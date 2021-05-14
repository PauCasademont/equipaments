import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js';

export const signup = async (req, res) => {

    const { username, public_facility_ids, password } = req.body;
    try {
        const oldUser = await UserModel.findOne({ username });
        if (oldUser) return res.status(400).json({ message: `User \'${username}\' already exist`});

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await UserModel.create({
            username,
            public_facility_ids,
            is_admin: false,
            password: hashedPassword
        });
        return res.status(201).json({ result });        
    } catch (error) {
        res.status(500).json({ message: 'Could not sing up'});
        console.log(error);
    }
}

export const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ 
                message: `User \'${username}\' does not exist`,
                clientMessage: `L'usuari \'${username}\' no existeix`
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                message: 'Invalid credentials', 
                clientMessage: 'La contrasenya no és correcte'
            });
        }
        
        const tokenData = {
            public_facility_ids: user.public_facility_ids,
            is_admin: user.is_admin
        };
        const token = jwt.sign(tokenData, process.env.CLIENT_SECRET, { expiresIn: '2h'});

        res.status(200).json({ 
            result: {              
                username: user.username,
                publicFacilityIds: user.public_facility_ids,
                isAdmin: user.is_admin,
                token
            } 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Could not sing in'
        });
        console.log(error);
    }
}