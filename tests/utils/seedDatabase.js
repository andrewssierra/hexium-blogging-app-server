import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const seedDatabase = async () => {
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
};

export {seedDatabase as default}