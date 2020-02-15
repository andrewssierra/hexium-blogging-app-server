import '@babel/polyfill/noConflict';
import { GraphQLServer } from 'graphql-yoga';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers';
import db from './db';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            db,
            prisma,
            request
        };
    },
    fragmentReplacements
});

server.start({ port: process.env.PORT || 4000}, () => {
    console.log('\n Server is running ʕ•́ᴥ•̀ʔっ \n\n');
});
