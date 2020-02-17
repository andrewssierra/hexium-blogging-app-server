import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getProfile, login, getUsers } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should create a new user', async () => {
    const variables = {
        data: {
            name: 'Jessica',
            email: 'jessica@test.com',
            password: 'password123'
        }
    };
    const response = await client.mutate({
        mutation: createUser,
        variables
    });

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });
    expect(userExists).toBe(true);
});

test('should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers });
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Kate');
});

test('should not login with bad credentials', async () => {
    const variables = {
        data: { email: 'kate@test.com', password: 'wrongpassword' }
    };
    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow();
});

test('should not be able to sign up with short password', async () => {
    const variables = {
        data: {
            email: 'test@123.com',
            password: '1234',
            name: 'test'
        }
    };
    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow();
});

test('should fetch user profile', async () => {
    const client = getClient(userOne.jwt);
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});
