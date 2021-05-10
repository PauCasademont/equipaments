import swal from 'sweetalert';
import tinycolor from 'tinycolor2';

import * as api from '../api/index.js';
import { 
    createAlert, 
    arrayStringToFloat, 
    inRangeLatitude, 
    inRangeLongitude, 
    getObjectDatasets, 
    replaceAccentsAndCapitals,
    getFacilityDatasetData,
    getAverageDatasets
} from './utils';
import { AREA, CONSUMPTION, PRICE, DATA_TYPES, COLORS } from '../constants/index.js';

export const getMapPublicFalcilities =  async () => {
    try {
        const { data } = await api.req_getMapPublicFacilities();
        return data.result;
    } catch (error){
        console.log(error);
    }
}

export const getPublicFacilityData = async (id) => {
    try {
        const { data } = await api.req_getPublicFacilityData(id);
        return data.result;  
    } catch (error) {
        console.log(error);
    }
}

export const getPublicFacilityDatasets = async (id, dataType, firstDataset) => {
    if(id){
        try {            
            const { data } = await api.req_getPublicFacilityData(id);
            const { name, area } = data.result; 
            const facilityData = data.result.data;  
            const dataValue = dataType == AREA ? CONSUMPTION : dataType;        
            let datasets = [];


            Object.keys(facilityData).map((concept, darkenAmount) => {
                Object.keys(facilityData[concept]).reverse().map((year, index) => {
                    const color = COLORS[ index % COLORS.length ];
                    if(facilityData[concept][year][dataType]){
                        datasets.push({
                            label: `${name} ${concept} ${year}`,
                            id,
                            name: `${name}`,
                            concept: `${concept}`,
                            year: `${year}`,
                            data: getFacilityDatasetData(facilityData[concept][year], dataValue, dataType, area),
                            borderColor: tinycolor(color).darken(darkenAmount*12),
                            hidden: !firstDataset,
                            fill: false
                        });

                        if(firstDataset) firstDataset = false;
                    }
                });
            });
            return datasets;
        } catch (error) {
            console.log(error);
        }
    }
}

export const getPublicFacilitiesDatasets = async (ids, dataType) => {
    let datasets = [];
    let firstDataset = true;
    for (const id of ids) {
        const newDatasets = await getPublicFacilityDatasets(id, dataType, firstDataset);
        datasets = datasets.concat(newDatasets);
        if(firstDataset) firstDataset = false;
    };
    return datasets;
}

// export const getTypologyAverageDatasets = async (typology, dataType) => {
//     try {
//         const { data } = await api.req_getTypologyAverage(dataType, typology);
//         const dataInfo = {
//             name: `MITJANA EQUIPAMENTS DE TIPOLOGIA ${typology.toUpperCase()}`,
//             id: typology,
//             area: null,
//             dataType: null,
//             firstDataset: false,
//             isAverage: true
//         };
//         return getObjectDatasets(data.result, dataInfo);
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getTypologyAverageDatasets = async (typology, dataType) => {
    try {
        const { data } = await api.req_getTypologyFacilities(typology);
        return getAverageDatasets(data.result, dataType, typology);
    } catch (error) {
        console.log(error);
    }
}

export const getPublicFacilityField = async (id, field) => {
    try {
        const { data } = await api.req_getPublicFacilityField(id, field);
        return data.result[field];
    } catch (error) {
        console.log(error);
    }
}

export const getInvisiblePublicFacilities = async () => {
    //Return: { facilityId1: { name: String, coordinates: Array() } ... facilityIdN: {...}}

    try {
        const { data } = await api.req_getInvisiblePublicFacilities();
        return data.result.reduce((result, facility) => {
            result[facility._id] = {
                name: facility.name,
                coordinates: facility.coordinates
            };
            return result;
        }, {});
    } catch (error) {
        console.log(error);
    }
}

export const updatePublicFacility = async (id, dataType, concept, year, newValues) => {
    let dbDataType = CONSUMPTION;
    if (DATA_TYPES[PRICE] == dataType) dbDataType = PRICE;
    else if (DATA_TYPES[AREA] == dataType) dbDataType = AREA;

    const body = {
        data_type: dbDataType,
        concept,
        year,
        new_values: newValues
    };
    try {
        const updatedPublicFacility = await api.req_updatePublicFacility(id, body);
        createAlert('L\'equipament s\'ha actualitzat correctament', '', 'success');
        return updatedPublicFacility.data.result;
    } catch (error) {
        createAlert('Error a l\'actualitzar l\'equipament');
        console.log(error);
    }
}

const hasValuesCSV_row = (row) => {
    return row != '' && row[0] != ';'
}

const importCSV_row = async (row, year) => {
    if (hasValuesCSV_row(row)){
        const values = row.split(';');
        console.log(values[1]);
        const typology = replaceAccentsAndCapitals(values[2])
        const newData = {
            name: values[1].toUpperCase(),
            typology,
            concept: values[0],
            year,
            area: values[3],
            consumption: arrayStringToFloat(values.slice(5, 17)),
            price: arrayStringToFloat(values.slice(17)),
        }
        await api.req_importData(newData);
    }
}

export const importDataFromCSV = async (strFile, fileName) => {
    //Note1: file name has to end with the year of the data e.g. consum-2021.csv
    //Note2: every row of the file has to contain 29 columns. Concept, Name, Typology, Area, Users, Consumption value x12, Price value x12.

    const year = parseInt(fileName.substring(fileName.length - 8, fileName.length - 4));
    if(!year){
        createAlert('Error', 'L\'any del fitxer no és numèric.\nRevisa que el format del nom sigui correcte');
        return;
    }

    const startIndex = strFile.indexOf('\n');

    const nColumns = strFile.slice(0, startIndex).split(';').length;
    if (nColumns != 29){
        createAlert('Error a l\'importar dades', 'El format del fitxer no és correcte');
        return;
    }

    swal({
        title: `Les dades del fitxer corresponen a l\'any ${year}?`, 
        text: 'Si l\'any és erroni revisa el format del nom del fitxer', 
        icon: 'info',
        buttons: ['No', 'Si'] 
    }).then( async (isYearCorrect) => {
        if(isYearCorrect){
            try {
                const rows = strFile.slice(startIndex + 1).split('\n');
                for (const row of rows){
                    await importCSV_row(row, year);
                }
                createAlert('Les dades s\'han actualitzat correctament', '', 'success');
            } catch (error) {
                createAlert('Error a l\'importar les dades');
                console.log(error);
            }
        }
    });
}

export const updateCoordinates = async (id, newCoords) => {
    if(!newCoords[0] || !newCoords[1] || !inRangeLatitude(newCoords[0]) || !inRangeLongitude(newCoords[0])){
        createAlert('Coordenades no vàlides');
        return false;
    } 
    try {
        await api.req_updateCoordinates(id, { newCoords });
        createAlert('Canvis guardats correctament', '', 'success');
        return true;
    } catch (error) {
        createAlert('Les coordenades no s\'han pogut actualitzar');
        console.log(error);
    }
}

