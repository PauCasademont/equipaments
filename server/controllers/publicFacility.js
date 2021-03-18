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

export const getTypologyAverage = async (req, res) => {
    const { type, typology } = req.params;

    try {
        const { data } = await PublicFacilityModel.find({"typology": `${typology}`}, 'name data');
        let result = {};
        data.map(concept => {
            let sumYears = Array(12).fill(0);
            const nYears = Object.keys(concept).length;

            concept.map(year => {
                sumYears = sumYears.map((value,index) => (
                    value + year[type][index]
                ))
            });

            result[concept] = nYears == 0 ? 0 : sumYears.map(value => (value / sumYears))
        })
        // Mitjana 1 equipament per anys. 
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: `Could not get the consumtpion average for public facilities with typology: ${typology}` });
        console.log(error);
    }

}