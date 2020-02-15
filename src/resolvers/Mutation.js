import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import getWebToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
    async createUser(root, args, { prisma }, info) {
        const password = await hashPassword(args.data.password);
        const emailUsed = await prisma.exists.User({ email: args.data.email });
        if (emailUsed) {
            throw new Error('Email is already being used');
        }
        const user = prisma.mutation.createUser({
            data: { ...args.data, password }
        });
        return {
            user,
            token: getWebToken(user.id)
        };
    },
    async login(root, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });
        if (!user.email) {
            throw new Error('Unable to login');
        }
        const isMatch = bcrypt.compare(args.data.password, user.password);
        if (isMatch) {
            return {
                user,
                token: getWebToken(user.id)
            };
        } else {
            throw new Error('Unable to login');
        }
    },
    async deleteUser(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const exists = await prisma.exists.User({ id: userId });
        if (exists === -1) {
            throw new Error('User not found');
        }
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    async updateUser(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }
        return prisma.mutation.updateUser(
            {
                where: { id: userId },
                data: { name: args.data.name, email: args.data.email }
            },
            info
        );
    },
    async createPost(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.createPost(
            {
                data: {
                    title: args.data.title,
                    published: args.data.published,
                    body: args.data.body,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    async deletePost(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!postExists) {
            throw new Error('Unable to delete post');
        }
        return prisma.mutation.deletePost({ where: { id: args.id } }, info);
    },
    async updatePost(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!postExists) {
            throw new Error('Post does not exist');
        }
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        });
        if (isPublished && args.data.published === false) {
            prisma.mutation.deleteManyComments({
                where: { post: { id: args.id } }
            });
        }
        return prisma.mutation.updatePost(
            {
                data: args.data,
                where: {
                    id: args.id
                }
            },
            info
        );
    },
    async createComment(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const isPublished = await prisma.exists.Post({
            published: true,
            id: args.data.post
        });
        if (!isPublished) {
            throw new Error('Can not create comment');
        }
        return prisma.mutation.createComment(
            {
                data: {
                    text: args.data.text,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    post: { connect: { id: args.data.post } }
                }
            },
            info
        );
    },
    async deleteComment(root, args, { prisma, request }) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            author: {
                id: userId
            },
            id: args.id
        });
        if (!commentExists) {
            throw new Error('Comment can not be deleted');
        }
        return prisma.mutation.deleteComment({ where: { id: args.id } });
    },
    async updateComment(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            author: {
                id: userId
            },
            id: args.id
        });
        if (!commentExists) {
            throw new Error('Comment can not be updated');
        }
        return prisma.mutation.updateComment(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        );
    }
};

export { Mutation as default };
