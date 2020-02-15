import jwt from 'jsonwebtoken';

const getWebToken = userId => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '12 h' });
};

export { getWebToken as default };
