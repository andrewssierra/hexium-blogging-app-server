import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();

beforeEach(seedDatabase);
test('should only return published posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `;
    const response = await client.query({ query: getPosts });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('should fetch my posts', async () => {
    const client = getClient(userOne.jwt);
    const getMyPosts = gql`
        query {
            myPosts {
                title
                body
                id
                published
            }
        }
    `;
    const { data } = await client.query({ query: getMyPosts });
    expect(data.myPosts.length).toBe(2);
});

test('should be able to update own post', async () => {
    const client = getClient(userOne.jwt);
    const updatePost = gql`
        mutation {
            updatePost (
                id: "${postOne.post.id}",
                data: {
                    published: false
                }
            ){
                id
                title
                body
                published
            }
        }
    `;
    const { data } = await client.mutate({ mutation: updatePost });
    const exists = await prisma.exists.Post({
        id: postOne.post.id,
        published: false
    });
    expect(data.updatePost.published).toBe(false);
    expect(exists).toBe(true);
});

test('should create a new post', async () => {
    const client = getClient(userOne.jwt);
    const createPost = gql`
        mutation {
            createPost(
                data: { title: "test post", body: "test post", published: true }
            ) {
                title
                body
                published
            }
        }
    `;
    const { data } = await client.mutate({ mutation: createPost });
    const exists = await prisma.exists.Post({ title: 'test post' });
    expect(data.createPost.title).toBe('test post');
    expect(data.createPost.published).toBe(true);
    expect(data.createPost.body).toBe('test post');
    expect(exists).toBe(true);
});

test('should delete post', async () => {
    const client = getClient(userOne.jwt);

    const deletePost = gql`
        mutation {
            deletePost(id: "${postTwo.post.id}"){
                id
            }
        }
    `;
    await client.mutate({ mutation: deletePost });
    const exists = await prisma.exists.Post({ id: postTwo.post.id });
    expect(exists).toBe(false);
});
