import getUserId from '../utils/getUserId';

const Query = {
    comments(root, args, { prisma }, info) {
        const { first, skip, after, orderBy } = args;
        const opArgs = {
            first,
            skip,
            after,
            orderBy
        };
        return prisma.query.comments(opArgs, info);
    },
    users(root, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };
        if (args.query) {
            opArgs.where = {
                OR: [
                    { name_contains: args.query },
                    { email_contains: args.query }
                ]
            };
        }
        return prisma.query.users(opArgs, info);
    },
    posts(root, { query, first, skip, after }, { prisma }, info) {
        const opArgs = {
            first,
            skip,
            after,
            where: {
                published: true
            }
        };
        if (query) {
            opArgs.where.OR = [
                { title_contains: query },
                { body_contains: query }
            ];
        }
        return prisma.query.posts(opArgs, info);
    },
    async myPosts(parent, args, { prisma, request }, info) {
        const { query, first, skip, after, orderBy } = args;
        const userId = getUserId(request);
        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        };
        if (query) {
            opArgs.where.OR = [
                { title_contains: query },
                { body_contains: query }
            ];
        }
        return await prisma.query.posts(opArgs, info);
    },
    async me(root, args, { prisma, request }) {
        const userId = getUserId(request);
        return await prisma.query.user({
            where: {
                id: userId
            }
        });
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false);
        const posts = await prisma.query.posts(
            {
                where: {
                    id: args.id,
                    OR: [
                        {
                            published: true
                        },
                        {
                            author: {
                                id: userId
                            }
                        }
                    ]
                }
            },
            info
        );

        if (posts.length == 0) {
            throw new Error('Post not found');
        }

        return posts[0];
    }
};

export { Query as default };
