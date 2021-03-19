import bcrypt from 'bcryptjs';

import UserModel from '../models/user.js';

export const signup = async (req, res) => {
    const { username, public_facility_id, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ username });
        if (oldUser) res.status(400).json({ message: `User \'${username}\' already exist`});

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await UserModel.create({
            username,
            public_facility_id,
            password: hashedPassword
        });
        res.status(201).json({ result });        
    } catch (error) {
        res.status(500).json({ message: 'Could not sing up'});
        console.log(error);
    }
}

export const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).json({ message: `User \'${username}\' does not exist`});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials'});

        res.status(200).json({ result: user });
    } catch (error) {
        res.status(500).json({ message: 'Could not sing in'});
        console.log(error);
    }
}