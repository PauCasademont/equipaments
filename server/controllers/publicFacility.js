import publicFacilityModel from '../models/publicFacility.js';

export const createPublicFacility = async (req, res) => {
    try {
        const result = await publicFacilityModel.create(req.body);
        res.status(201).json({result});
    } catch (error) {
        res.status(409).json({ message: "Infrastructure could not be create"});
        console.log(error);
    }
}