import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token == null) return res.status(401).send({ message: 'No valid access'});

        jwt.verify(token, process.env.CLIENT_SECRET, (err, user) => {
            if (err) return res.status(403).send({ message: 'Unvalid access token'});
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error)
    }
} 