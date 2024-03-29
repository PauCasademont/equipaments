import mongoose from 'mongoose';

import PublicFacilityModel from '../models/publicFacility.js';

const DATA_TYPES = {
    consumption: 'consumption',
    price: 'price',
    area: 'area',
    coordinates: 'coordinates',
    typology: 'typology'
};

export const createPublicFacility = async (req, res) => {
//Permission: administrator

    const { name } = req.body;

    try {

        if(!req.user) {
            return res.status(401).send({ message: 'User unauthenticated'});
        }

        if(!req.user.is_admin){
            return res.status(404).send({ message: 'Permission denied'});
        }

        //Check if already exist
        const oldPublicFacility = await PublicFacilityModel.findOne({ name });
        if (oldPublicFacility) return res.status(400).json({ message: `Public facility \'${name}\' already exists`})

        const result = await PublicFacilityModel.create(req.body);
        res.status(201).json({result});
    } catch (error) {
        res.status(500).json({ 
            message: 'Public facility could not be created',
            clientMessage: `Ja existeix l\'equipament ${name}`
        });
        console.log(error);
    }
}

export const deletePublicFacility = async (req, res) => {
//Permission: administrator

    const { id } = req.params;

    try {

        if(!req.user) {
            return res.status(401).send({ message: 'User unauthenticated'});
        }

        if(!req.user.is_admin){
            return res.status(404).send({ message: 'Permission denied'});
        }
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({ message: `No valid user id: ${facilityId}`});
        }

        await PublicFacilityModel.findByIdAndRemove(id);
        res.status(200).json({ result: 'Public faicility deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Public facility could not be created'});
        console.log(error);
    }
}


export const getMapPublicFalcilities = async (req, res) => {
//Return a list of facilities. Every facility has to have: id, name, typology, coordinates, area, 
//list of years that contains data, boolean to know if it has consumption data, 
//boolean to know if it has price data, users admins of the facility.

    try { 
        //Get only facilities that have coordinates
        const facilities = await PublicFacilityModel.find({ coordinates: { $ne: [] }});

        const result = facilities.map(facility => {
            const { years, hasConsumptionData, hasPriceData } = getFacilityDataInfo(facility.data);
            return {
                id: facility._id,
                name: facility.name,
                typology: facility.typology,
                coordinates: facility.coordinates,
                area: facility.area,
                years,
                hasConsumptionData,
                hasPriceData,                
                users: facility.users || []
            }
        });
        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Could not get public facilities'});
        console.log(error);
    }
}

const getFacilityDataInfo = (data) => {
//Return list of years that have data and boolean to know if it has consumption and price data.

    let years = [];
    let hasConsumptionData = false;
    let hasPriceData = false;

    Object.keys(data).forEach(concept => {
        Object.keys(data[concept]).forEach(strYear => {
            const year = parseInt(strYear);

            if(!years.includes(year) && hasValuesYear(data, concept, strYear)){
                years.push(year);
            }

            if(!hasConsumptionData && DATA_TYPES.consumption in data[concept][year]){
                hasConsumptionData = true;
            }

            if(!hasPriceData && DATA_TYPES.price in data[concept][year]){
                hasPriceData = true;
            }

        });
    });
    return { years, hasConsumptionData, hasPriceData };
}

const hasValuesYear = (data, concept, year) => {
    //List of 0 equals empty data
    return (
        !data[concept][year][DATA_TYPES.consumption]?.every(value => value == 0) ||
        !data[concept][year][DATA_TYPES.price]?.every(value => value == 0) 
    );
}

export const updatePublicFaility = async (req, res) => {
//Permission: registered user or administrator

    const { id } = req.params;

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    if(!req.user.public_facility_ids.includes(id) && !req.user.is_admin){
        return res.status(404).send({ message: 'Permission denied'});
    }

    try {
        const publicFacility = await PublicFacilityModel.findById(id);
        const { data_type, new_values, concept, year } = req.body;
        if (data_type == DATA_TYPES.typology){
            publicFacility.typology = new_values[0];
        }

        else if (data_type == DATA_TYPES.area) {
            publicFacility.area = new_values[0];
        }

        else if (data_type == DATA_TYPES.coordinates){
            publicFacility.coordinates = new_values;
        }

        else {
            if (!publicFacility.data[concept]) publicFacility.data[concept] = {};
            if (!publicFacility.data[concept][year]) publicFacility.data[concept][year] = {};
            publicFacility.data[concept][year][data_type] = new_values;
        }

        const result = await PublicFacilityModel.findByIdAndUpdate(id, publicFacility, { new: true });
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not update public facility'});
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

export const getInvisiblePublicFacilities = async (req, res) => {
    //Return id and name for facilities that don't have coordiantes
    try {
        const result = await PublicFacilityModel.find({ coordinates: [] },'name coordinates');
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facility data'});
        console.log(error);
    }
}

export const importData = async (req, res) => {
//Permission: administrator

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin){
        return res.status(403).send({ message: 'Permission denied'});
    }

    try {
        const { name, year, typology, area, concept, consumption, price } = req.body;
        let publicFacility = await PublicFacilityModel.findOne({ name });
        let notImportedDataTypes = [];

        //Create facility if it doesn't exist
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

        //Save data if year field doesn't exist
        if(!publicFacility.data[concept][year]){
            publicFacility.data[concept][year] = {consumption, price};
        }

        //Save data if not overwritten
        else{
            if(!publicFacility.data[concept][year].consumption){
                publicFacility.data[concept][year].consumption = consumption;
            } 
            else notImportedDataTypes.push(DATA_TYPES.consumption);
            if(!publicFacility.data[concept][year].price){
                publicFacility.data[concept][year].price = price;
            } 
            else notImportedDataTypes.push(DATA_TYPES.price); 
        }

        await PublicFacilityModel.findByIdAndUpdate(publicFacility._id, publicFacility, { new: true });
        
        //Return data types that haven't been updated
        res.status(200).send({ message: 'Updated successfully', notImportedDataTypes});
        
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong'});
        console.log(error);
    }
}

export const updateCoordinates = async (req, res) => {
//Permission: administrator

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin){
        return res.status(404).send({ message: 'Permission denied'});
    }

    const { newCoords } = req.body;
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    try {
        let publicFacility = await PublicFacilityModel.findById(id);
        publicFacility.coordinates = newCoords;
        await PublicFacilityModel.findByIdAndUpdate(id, publicFacility, { new: true });
        res.status(200).send({ message: 'Updated successfully'});
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong'});
        console.log(error);
    }
}

export const getPublicFacilitiesNames = async (req, res) => {

    try {
        const result = await PublicFacilityModel.find({}, 'name');
        res.status(200).send({result});
        
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facilities names'});
        console.log(error);
    }
}

export const getPublicFacilityField = async (req, res) => {
    const { id, field } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    try {
        const result = await PublicFacilityModel.findById(id, field);
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: `Could not get public facility ${field}`});
        console.log(error);
    }
}

export const getTypologyFacilities = async (req, res) => {
//Return data and area if facilities of the same typology

    const { typology } = req.params;

    try {
        const result = await PublicFacilityModel.find({ typology }, 'data area');    
        res.status(200).send({ result });
    } catch (error) {
        res.status(500).send({ message: 'Could not get typology facilities'});
        console.log(error);
    }
}

export const addUserToFacility = async (facilityId, username) => {

    try {
        let facility = await PublicFacilityModel.findById(facilityId);
        if(facility.users) {
            facility.users.push(username);
        } else {
            facility.users = [username];
        }
        await PublicFacilityModel.findByIdAndUpdate(facilityId, facility, { new: true });
    } catch (error) {
        console.log(error);
    }
}

export const removeUserFromFacility = async (facilityId, username) => {

    try {
        let facility = await PublicFacilityModel.findById(facilityId);
        if(facility.users) {
            const index = facility.users.indexOf(username);
            if(index > -1){
                facility.users.splice(index, 1);
                await PublicFacilityModel.findByIdAndUpdate(facilityId, facility, { new: true });
            }
        } 
    } catch (error) {
        console.log(error);
    }
}

export const updateUsernamesFromFacilities = async (prevUsername, newUsername, facilityId) => {
    
    try {
        let facility = await PublicFacilityModel.findById(facilityId);
        if(facility.users){
            const index = facility.users.indexOf(prevUsername);
            if(index > -1){
                facilityWithUser.users[index] = newUsername;
                await PublicFacilityModel.findByIdAndUpdate(facility._id, facilityWithUser, { new: true });
            }
        }
    } catch (error) {
        console.log(error);
    }
}