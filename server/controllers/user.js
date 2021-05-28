import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import UserModel from '../models/user.js';

export const signup = async (req, res) => {

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin) {
        return res.status(404).send({ message: 'Permission denied'});
    }

    const { username, public_facility_ids, password } = req.body;
    try {
        const oldUser = await UserModel.findOne({ username });
        if (oldUser) return res.status(400).json({ 
            message: `User \'${username}\' already exist`,
            clientMessage: `Ja existeix un usuari de nom \'${username}\'`
        });

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
            id: user._id,
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

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin) {
        return res.status(404).send({ message: 'Permission denied'});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid user id: ${facilityId}`});
    }

    try {
        await UserModel.findByIdAndRemove(id);
        res.status(200).json({ result: 'User deleted successfully' }); 
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Could not delete user`});
    }
}
export const changePassword = async (req, res) => {
    const { current_password, new_password } = req.body;
    const { id } = req.params;

    try {

        if(!req.user) {
            return res.status(401).send({ message: 'User unauthenticated'});
        }

        if(req.user.id != id) {
            return res.status(404).send({ message: 'Permission denied'});
        }
    
        const user = await UserModel.findById(id);

        const isPasswordCorrect = await bcrypt.compare(current_password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                message: 'Invalid credentials', 
                clientMessage: 'La contrasenya actual no és correcte'
            });
        }

        user.password = await bcrypt.hash(new_password, 12);
        const result = await UserModel.findByIdAndUpdate(id, user, { new: true });
        return res.status(200).json({ result }); 
       
    } catch (error) {
        res.status(500).json({ 
            message: 'Could not change the password'
        });
        console.log(error);
    }
} 

export const adminChangePassword = async (req, res) => {
    const { new_password } = req.body;
    const { id } = req.params;

    try {

        if(!req.user) {
            return res.status(401).send({ message: 'User unauthenticated'});
        }

        if(!req.user.is_admin) {
            return res.status(404).send({ message: 'Permission denied'});
        }
    
        const user = await UserModel.findById(id);

        user.password = await bcrypt.hash(new_password, 12);
        const result = await UserModel.findByIdAndUpdate(id, user, { new: true });
        return res.status(200).json({ result }); 
       
    } catch (error) {
        res.status(500).json({ 
            message: 'Could not change the password'
        });
        console.log(error);
    }
}

export const adminChangeUsername = async (req, res) => {
    const { new_username } = req.body;
    const { id } = req.params;

    try {

        if(!req.user) {
            return res.status(401).send({ message: 'User unauthenticated'});
        }

        if(!req.user.is_admin) {
            return res.status(404).send({ message: 'Permission denied'});
        }
    
        const user = await UserModel.findById(id);

        user.username = new_username;
        const result = await UserModel.findByIdAndUpdate(id, user, { new: true });
        return res.status(200).json({ result }); 
       
    } catch (error) {
        res.status(500).json({ 
            message: 'Could not change the username'
        });
        console.log(error);
    }
}

export const getUsersNames = async (req, res) => {

    try {
        const result = await UserModel.find({ is_admin: false }, 'username');
        res.status(200).send({result});
        
    } catch (error) {
        res.status(500).send({ message: 'Could not get users names'});
        console.log(error);
    }
}

export const getUserField = async (req, res) => {
    const { id, field } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid user id: ${id}`});
    }

    try {
        const result = await UserModel.findById(id, field);
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: `Could not get user ${field}`});
        console.log(error);
    }
}

export const addUserFacility = async (req, res) => {
    const { id } = req.params;
    const { facilityId } = req.body;

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin) {
        return res.status(404).send({ message: 'Permission denied'});
    }

    if(!mongoose.Types.ObjectId.isValid(facilityId)){
        return res.status(404).send({ message: `No valid public facility id: ${facilityId}`});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid user id: ${facilityId}`});
    }

    try {
        const user = await UserModel.findById(id);
        user.public_facility_ids = user.public_facility_ids.concat([facilityId]);
        const result = await UserModel.findByIdAndUpdate(id, user, { new: true });
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not update user'});
        console.log(error);
    }
}

export const removeUserFacility = async (req, res) => {
    const { id } = req.params;
    const { facilityId } = req.body;

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin) {
        return res.status(404).send({ message: 'Permission denied'});
    }

    if(!mongoose.Types.ObjectId.isValid(facilityId)){
        return res.status(404).send({ message: `No valid public facility id: ${facilityId}`});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid user id: ${facilityId}`});
    }

    try {
        const user = await UserModel.findById(id);
        const index = user.public_facility_ids.indexOf(facilityId);
        if(index > -1){
            user.public_facility_ids.splice(index, 1);
        }
        const result = await UserModel.findByIdAndUpdate(id, user, { new: true });
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not update user'});
        console.log(error);
    }
}