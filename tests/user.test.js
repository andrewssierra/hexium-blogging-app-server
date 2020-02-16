import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
});

beforeEach(async () => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    await prisma.mutation.createUser({
        data: {
            name: 'Kate',
            email: 'kate@test.com',
            password: bcrypt.hashSync('test123$$$'),
            posts: {
                create: [
                    {
                        title:
                            'Ten Beautiful Reasons We Can not Help But Fall In Love With Food.',
                        body: 'food food food food',
                        published: true
                    },
                    {
                        title: 'Understanding The Background Of Food.',
                        body: 'food food food food',
                        published: false
                    }
                ]
            }
        }
    });
});

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

test('should only be able to get published posts', async () => {
    const getPosts = gql`
        query {
            posts {
                body
                title
                published
            }
        }
    `;

    const response = await client.query({ query: getPosts });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('Should not login with bad credentials', async () => {

    const login = gql`
        mutation {
            login(data: { email: "kate@test.com", password: "wrongpass!" }) {
                token
            }
        }
    `;
    await expect(client.mutate({ mutation: login })).rejects.toThrow();
   
});
