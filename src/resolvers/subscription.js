import getUserId from '../utils/getUserId';

const Subscription = {
    comment: {
        subscribe(root, { postId }, { prisma }, info) {
            return prisma.subscription.comment(
                {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                },
                info
            );
        }
    },
    post: {
        subscribe(root, args, { prisma }, info) {
            return prisma.subscription.post(
                {
                    node: {
                        post: {
                            published: true
                        }
                    }
                },
                info
            );
        }
    },
    myPosts: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request);
            return prisma.subscription.post(
                {
                    node: {
                        post: {
                            author: {
                                id: userId
                            }
                        }
                    }
                },
                info
            );
        }
    }
};

export { Subscription as default };
