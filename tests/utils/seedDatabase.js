import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
    input: {
        name: 'Kate',
        email: 'kate@test.com',
        password: bcrypt.hashSync('test123$$$')
    },
    user: undefined,
    jwt: undefined
};

const userTwo = {
    input: {
        name: 'Jennifer',
        email: 'jennifer@test.com',
        password: bcrypt.hashSync('test123$$$')
    },
    user: undefined,
    jwt: undefined
};

const postOne = {
    input: {
        title:
            'Ten Beautiful Reasons We Can not Help But Fall In Love With Food.',
        body: 'food food food food',
        published: true
    },
    post: undefined
};

const postTwo = {
    input: {
        title: 'Understanding The Background Of Food.',
        body: 'food food food food',
        published: false
    },
    post: undefined
};

const commentOne = {
    input: {
        text: 'great post'
    },
    comment: undefined
};

const commentTwo = {
    input: {
        text: 'this is a bad post'
    },
    comment: undefined
};

const seedDatabase = async () => {
    jest.setTimeout(30000);
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyComments();
    userOne.user = await prisma.mutation.createUser({
        data: {
            ...userOne.input
        }
    });

    userTwo.user = await prisma.mutation.createUser({
        data: {
            ...userTwo.input
        }
    });

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    userOne.jwt = await jwt.sign(
        { userId: userOne.user.id },
        process.env.JWT_SECRET
    );

    userTwo.jwt = await jwt.sign(
        { userId: userTwo.user.id },
        process.env.JWT_SECRET
    );

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });
};

export {
    seedDatabase as default,
    userOne,
    postOne,
    postTwo,
    userTwo,
    commentOne,
    commentTwo
};
