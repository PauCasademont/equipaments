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