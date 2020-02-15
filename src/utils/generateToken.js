import jwt from 'jsonwebtoken';

const getWebToken = userId => {
    return jwt.sign({ userId }, '10', { expiresIn: '12 h' });
};

export { getWebToken as default };
