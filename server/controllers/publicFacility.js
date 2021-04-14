import mongoose from 'mongoose';

import PublicFacilityModel from '../models/publicFacility.js';

export const createPublicFacility = async (req, res) => {
    const { name } = req.body;

    try {
        const oldPublicFacility = await PublicFacilityModel.findOne({ name });
        if (oldPublicFacility) return res.status(400).json({ message: `Public facility \'${name}\' already exists`})

        const result = await PublicFacilityModel.create(req.body);
        res.status(201).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Public facility could not be created'});
        console.log(error);
    }
}

export const getPublicFalcilities = async (req, res) => {
    try { 
        const result = await PublicFacilityModel.find({}, 'name typology coordinates area');
        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Could not get public facilities'});
        console.log(error);
    }
}

export const updatePublicFaility = async (req, res) => {
    const { id } = req.params;

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    if(id != req.user.public_facility_id && !req.user.is_admin){
        return res.status(404).send({ message: 'Permission denied'});
    }

    try {
        const publicFacility = await PublicFacilityModel.findById(id);
        const { data_type, new_values, concept, year } = req.body;

        if (data_type == 'area') {
            publicFacility.area = new_values[0];
        }

        else {
            if (!publicFacility.data[concept]) publicFacility.data[concept] = {};
            if (!publicFacility.data[concept][year]) publicFacility.data[concept][year] = {};
            publicFacility.data[concept][year][data_type] = new_values;
        }

        const result = await PublicFacilityModel.findByIdAndUpdate(id, publicFacility, { new: true });
        res.status(204).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Could not update public facility'});
        console.log(error);
    }

}

export const getPublicFacilityData = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    try {
        const result = await PublicFacilityModel.findById(id);
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facility data'});
        console.log(error);
    }
}

export const getPublicFacilityField = async (req, res) => {
    const { id, field } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    try {
        const result = await PublicFacilityModel.findById(id, `${field}`);
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facility field'});
        console.log(error);
    }
}

export const importData = async (req, res) => {
    const { name, year, typology, area, concept, consumption, price } = req.body;

    try {
        let publicFacility = await PublicFacilityModel.findOne({ name });

        if (!publicFacility) {
            publicFacility = await PublicFacilityModel.create({
                name,
                typology,
                area: area ? area : 0,
                coordinates: [],
                data: {}
            });
        }

        if(!publicFacility.data[concept]) publicFacility.data[concept] = {};
        if(!publicFacility.data[concept][year]) {
            publicFacility.data[concept][year] = {consumption, price};
            await PublicFacilityModel.findByIdAndUpdate(publicFacility._id, publicFacility, { new: true });
        }

        res.status(200).send({ message: 'Updated successfully'});
        
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong'});
        console.log(error);
    }
}