import bcrypt from 'bcryptjs';

import UserModel from '../models/user.js';

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