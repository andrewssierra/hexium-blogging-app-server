// Demo User data
const users = [
    {
        id: '1',
        name: 'Sierra',
        email: 'user@test.com',
        age: 27
    },
    {
        id: '2',
        name: 'Mike',
        email: 'mike@test.com'
    },
    {
        id: '3',
        name: 'Sean',
        email: 'sean@test.com'
    }
];

const posts = [
    {
        id: '1',
        title: 'This is a post',
        body: 'This is a body',
        published: false,
        author: '1'
    },
    {
        id: '2',
        title: 'This is another post',
        body: 'This is another body',
        published: true,
        author: '3'
    },
    {
        id: '3',
        title: 'Best title',
        body: 'Best body',
        published: true,
        author: '3'
    }
];

const comments = [
    {
        id: '1',
        text: 'Good blog post',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Bad blog post',
        author: '2',
        post: '2'
    },
    {
        id: ' 3',
        text: 'I have no feelings regarding this blog post',
        author: '3',
        post: '3'
    },
    {
        id: '4',
        text: 'post post post post',
        author: '1',
        post: '2'
    }
];

const db = {
    users,
    posts,
    comments
};

export { db as default };
