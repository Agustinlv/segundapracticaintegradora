import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const PRIVATE_KEY = 'CoderKey';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {

    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '1d'});

    return token;

};

export const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    const token = authHeader.split(' ')[1];

    if (token === 'null') {

        return res.status(401).send({status: 'Error', error: 'Unauthorized'});

    };

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {

        if (error) return res.status(401).send({status: 'Error', error: 'Token error'});

        req.user = credentials.user;

        next();

    });

};

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export default __dirname;