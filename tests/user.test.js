import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, {userOne} from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient()

beforeEach(seedDatabase);

test('should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Jessica"
                    email: "jessica6@test.com"
                    password: "password"
                }
            ) {
                token
                user {
                    id
                }
            }
        }
    `;

    const response = await client.mutate({
        mutation: createUser
    });

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });
    expect(userExists).toBe(true);
});

test('should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;

    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Kate');
});

test('should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            login(data: { email: "kate@test.com", password: "wrongpassword" }) {
                token
            }
        }
    `;
    await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test('should not be able to sign up with short password', async ()=> {
    const createUser = gql`
        mutation{
            createUser(data:{email:"test@123.com", password:"1234", name: "test"}){
                token
            }
        }
    `
    await expect(client.mutate({mutation: createUser})).rejects.toThrow();
})

test('should fetch user profile', async() => {
    const client = getClient(userOne.jwt)
    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `
    const { data } = await client.query({query: getProfile });
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
})

