import mongoose from 'mongoose';

import PublicFacilityModel from '../models/publicFacility.js';

const CONCEPTS = ['Total', 'Electricitat', 'Gas', 'Gasoil-Biomassa'];
const DATA_TYPES = {
    consumption: 'consumption',
    price: 'price',
    area: 'area'
};

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

export const getMapPublicFalcilities = async (req, res) => {
    try { 
        const facilities = await PublicFacilityModel.find({ coordinates: { $ne: [] }});
        const result = facilities.map(facility => ({
            id: facility._id,
            name: facility.name,
            typology: facility.typology,
            coordinates: facility.coordinates,
            area: facility.area,
            years: getPublicYearsFromData(facility.data)
        }));
        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Could not get public facilities'});
        console.log(error);
    }
}

const getPublicYearsFromData = (data) => {
    let years = []
    Object.keys(data).forEach(concept => {
        Object.keys(data[concept]).forEach(strYear => {
            const year = parseInt(strYear);
            if(!years.includes(year)){
                years.push(year);
            }
        });
    });
    return years;
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

        if (data_type == DATA_TYPES.area) {
            publicFacility.area = new_values[0];
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
    try {
        const result = await PublicFacilityModel.find({ coordinates: [] },'name coordinates');
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facility data'});
        console.log(error);
    }
}

export const importData = async (req, res) => {

    if(!req.user) {
        return res.status(401).send({ message: 'User unauthenticated'});
    }

    if(!req.user.is_admin){
        return res.status(404).send({ message: 'Permission denied'});
    }

    try {
        const { name, year, typology, area, concept, consumption, price } = req.body;
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

export const updateCoordinates = async (req, res) => {
    
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

export const getPublicFacilityField = async (req, res) => {
    const { id, field } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send({ message: `No valid public facility id: ${id}`});
    }

    try {
        const result = await PublicFacilityModel.findById(id, field);
        res.status(200).send({result});
    } catch (error) {
        res.status(500).send({ message: 'Could not get public facility field'});
        console.log(error);
    }
}

const getYearsList = () => {
    const firstYear = 2013;
    const currentYear = new Date().getFullYear();
    return Array(currentYear - firstYear + 1).fill().map((_, index) => firstYear + index); 
}

const getAverageArrays = (arrays) => {
    let result = [];
    for(let indexValue = 0; indexValue < 12; indexValue++){
        let addedValues = 0; 
        for(let indexArray = 0; indexArray < arrays.length; indexArray++){
            addedValues += arrays[indexArray][indexValue];
        }
        const averageValue = Math.round(addedValues/arrays.length);
        result.push(averageValue);
    }
    return result;
}

const objectIsEmpty = (object) => {
    return Object.keys(object).length == 0;
}

const facilityHasValues = (facility, concept, year, dataType, valueType) => {
    if(facility.data[concept] && facility.data[concept][year] && facility.data[concept][year][valueType]){
        if(dataType != DATA_TYPES.area) return true;
        return facility.area;
    }
    return false;
}

const getConceptYearArrays = (facilities, concept, year, dataType) => {
    const result = [];
    const valueType = dataType == DATA_TYPES.area ? DATA_TYPES.consumption : dataType;
    facilities.forEach(facility => {
        if(facilityHasValues(facility, concept, year, dataType, valueType)){
            let newArray = facility.data[concept][year][valueType];
            if(dataType == DATA_TYPES.area){
                newArray = newArray.map(value => value / facility.area);
            }
            result.push(newArray);
        }
    });
    return result;
}

export const getTypologyAverage = async (req, res) => {
    const { data_type, typology } = req.params;
    const years = getYearsList();
    const result = {};

    try {
        const facilities = await PublicFacilityModel.find({ typology }, 'data area');

        CONCEPTS.forEach(concept => {
            result[concept] = {};
            years.forEach(year => {
                const arrays = getConceptYearArrays(facilities, concept, year, data_type);
                if(arrays.length){
                    result[concept][year] = getAverageArrays(arrays);
                }
            });
            if(objectIsEmpty(result[concept])) delete result[concept];
        });

        res.status(200).send({ result });
    } catch (error) {
        res.status(500).send({ message: 'Could not get typology average'});
        console.log(error);
    }
}