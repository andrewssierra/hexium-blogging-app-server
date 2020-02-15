import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'c905e439-38a6-40bc-b667-4ac07b95dacf',
    fragmentReplacements
});

export { prisma as default };
