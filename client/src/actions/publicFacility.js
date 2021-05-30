import swal from 'sweetalert';
import tinycolor from 'tinycolor2';

import * as api from '../api/index.js';
import { 
    createAlert, 
    arrayStringToInt, 
    inRangeLatitude, 
    inRangeLongitude,  
    replaceAccentsAndCapitals,
    getFacilityDatasetData,
    getAverageDatasets,
    addArrayObjectsIds,
    getTypologyUserFormat
} from './utils';
import { AREA, CONSUMPTION, PRICE, COORDINATES, DATA_TYPES, COLORS, TYPOLOGY } from '../constants/index.js';

export const createPublicFacility = async (form) => {
    try {
        if(!inRangeLatitude(form.latitude) || !inRangeLongitude(form.longitude)){
            createAlert('Coordenades no vàlides!');
            return;
        }
        const body = {
            name: form.name.toUpperCase(),
            typology: form.typology,
            coordinates: [form.latitude, form.longitude],
            area: form.area ? form.area : 0,
            data: {}
        }
        const { data } = await api.req_createPublicFacility(body);

        createAlert(`Equipament ${form.name} creat correctament`, '', 'success');

        return data.result;
    } catch (error) {
        console.log(error)
    }
}

export const deletePublicFacility = async (publicFacility) => {
    return await swal({
        title: 'Eliminar Equipament',
        text: `Estàs segur que desitges eliminar l\'equipament ${publicFacility.name}`,
        icon: 'warning',
        buttons: ['Cancelar', 'Eliminar']
    }).then(async (wantToDelete) =>  {
        if(wantToDelete){
            try {
                const { data } = await api.req_deletePublicFacility(publicFacility.id);
                createAlert('', 'Equipament eliminat correctament', 'success');
                return data.result;
            } catch (error) {
                console.log(error);
                createAlert('Error', `No s\'ha pogut eliminar l\'usuari ${publicFacility.name}`);
            }
        }
        return null;
    })
}

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
            const { name, area, typology } = data.result; 
            const facilityData = data.result.data;  
            const dataValue = dataType == AREA ? CONSUMPTION : dataType; 
            let datasets = [];


            Object.keys(facilityData).map((concept, darkenAmount) => {
                Object.keys(facilityData[concept]).reverse().map((year, index) => {
                    const color = COLORS[ index % COLORS.length ];
                    if(facilityData[concept][year][dataValue]){
                        const values = getFacilityDatasetData(facilityData[concept][year], dataValue, dataType, area);
                        if(!values.every(value => value == 0)){
                            datasets.push({
                                label: `${name} ${concept} ${year}`,
                                id,
                                name: `${name} | Tipologia: ${getTypologyUserFormat(typology)}`,
                                concept: `${concept}`,
                                year: `${year}`,
                                data: values,
                                borderColor: tinycolor(color).darken(darkenAmount*12),
                                hidden: !firstDataset,
                                fill: false
                            });

                            if(firstDataset) firstDataset = false;
                        }
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


export const getTypologyAverageDatasets = async (typology, dataType) => {
    try {
        const { data } = await api.req_getTypologyFacilities(typology);
        return getAverageDatasets(data.result, dataType, typology);
    } catch (error) {
        console.log(error);
    }
}

export const getPublicFacilitiesNames = async () => {
    const { data } = await api.req_getPublicFacilitiesNames();
    return data.result.map(facility => ({
        id: facility._id,
        name: facility.name
    }));
}

export const getPublicFacilityField = async (id, field) => {
    try {
        const { data } = await api.req_getPublicFacilityField(id, field);
        return data.result[field];
    } catch (error) {
        console.log(error);
    }
}

export const getPublicFacilitiesNamesFromIds = async (ids) => {
    let names = [];
    for (const id of ids) {
        const name = await getPublicFacilityField(id, 'name');
        if(name) names.push({ id, name });
    };
    return names;
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
    else if (DATA_TYPES[COORDINATES] == dataType) dbDataType = COORDINATES;
    else if (DATA_TYPES[TYPOLOGY] == dataType) dbDataType = TYPOLOGY;

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
        const typology = replaceAccentsAndCapitals(values[2])
        console.log(values[1]);
        const newData = {
            name: values[1].toUpperCase(),
            typology,
            concept: values[0] == 'Gasoil_biomassa' ? 'Gasoil_Biomassa' : values[0],
            year,
            area: values[3],
            consumption: arrayStringToInt(values.slice(5, 17)),
            price: arrayStringToInt(values.slice(17)),
        }
        const { data } = await api.req_importData(newData);

        if(data.notImportedDataTypes.length){
            const notImportedResult =  data.notImportedDataTypes.map(dataType => ({
                name: newData.name,
                concept: newData.concept,
                dataType: dataType == CONSUMPTION ? 'Consum' : 'Preu'
            }));
           
            return notImportedResult;
        }
    }
    return [];
}

export const importDataFromCSV = async (strFile, year) => {
    let notImportedData = [];
    const startIndex = strFile.indexOf('\n');

    const nColumns = strFile.slice(0, startIndex).split(';').length;
    if (nColumns != 29){
        createAlert('Error a l\'importar dades', 'El format del fitxer no és correcte');
        return;
    }

    try {
        const rows = strFile.slice(startIndex + 1).split('\n');
        for (const row of rows){
            const notImportedDataFromRow = await importCSV_row(row, year);
            notImportedData = notImportedData.concat(notImportedDataFromRow);
        }        
        return addArrayObjectsIds(notImportedData);
    } catch (error) {
        createAlert('Error a l\'importar les dades');
        console.log(error);
    }
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

