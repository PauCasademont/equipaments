//Verify user token. headers: { authorization: 'bearer token' }
//The tokens are created in controllers.user.signin function
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token == null) return res.status(401).send({ message: 'No valid access'});

        jwt.verify(token, process.env.CLIENT_SECRET, (err, user) => {
            if (err) return res.status(403).send({ message: 'Unvalid access token'});
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Could not verify access token'});
    }
} 

export default auth;