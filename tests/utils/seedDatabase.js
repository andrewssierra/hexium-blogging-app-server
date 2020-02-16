import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: 'Kate',
        email: 'kate@test.com',
        password: bcrypt.hashSync('test123$$$')
    },
    user: undefined,
    jwt: undefined
};

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    userOne.user = await prisma.mutation.createUser({
        data: {
            ... userOne.input,
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
    
     userOne.jwt = await jwt.sign(
         { userId: userOne.user.id },
         process.env.JWT_SECRET
     );
};

export {seedDatabase as default, userOne}