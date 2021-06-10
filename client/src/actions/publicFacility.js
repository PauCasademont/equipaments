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
    getAverageAndDeviationDatasets,
    addArrayObjectsIds,
    getTypologyUserFormat
} from './utils';
import { AREA, CONSUMPTION, PRICE, COORDINATES, DATA_TYPES, COLORS, TYPOLOGY, SUPERSCRIPT_TWO, MONTHS } from '../constants/index.js';

export const createPublicFacility = async (form) => {
    try {

        //Check coordinates 
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
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}

export const deletePublicFacility = async (publicFacility) => {

    //Warning alert
    return await swal({
        title: 'Eliminar Equipament',
        text: `Estàs segur que desitges eliminar l\'equipament ${publicFacility.name}`,
        icon: 'warning',
        buttons: ['Cancelar', 'Eliminar']
    }).then(async (wantToDelete) =>  {

        //If user accepts
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
//Return a list of facilities. Every facility has to have: id, name, typology, coordinates, area, 
//years (list of years that contains data), hasConsumptionData (boolean to know if it has consumption data), 
//hasPriceData (boolean to know if it has price data), users (admins of the facility).

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
//Return a list of datasets ready to use in Chart js

    if(id){
        try {            
            const { data } = await api.req_getPublicFacilityData(id);
            const { name, area, typology } = data.result; 
            const facilityData = data.result.data;
            
            //If dataType is area, we need comsunption values
            const dataValue = dataType == AREA ? CONSUMPTION : dataType; 

            let datasets = [];

            //darkenAmount is the index for concepts. For every concept the color is darker.
            Object.keys(facilityData).map((concept, darkenAmount) => {
                Object.keys(facilityData[concept]).reverse().map((year, index) => {

                    const color = COLORS[ index % COLORS.length ];

                    if(facilityData[concept][year][dataValue]){
                        //values is the data that the chart will display
                        const values = getFacilityDatasetData(facilityData[concept][year], dataValue, dataType == AREA, area);

                        //Check if it has values
                        if(!values.every(value => value == 0)){

                            datasets.push({
                                label: `${name} ${concept} ${year}`,
                                id,
                                name,
                                menuName: `${name} | Tipologia: ${getTypologyUserFormat(typology)}`,
                                concept: `${concept}`,
                                year: `${year}`,
                                data: values,
                                borderColor: tinycolor(color).darken(darkenAmount*12),
                                hidden: !firstDataset,
                                fill: false
                            });

                            //Only show the first dataset by default
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
//Return a list of datasets ready to use in Chart js. 
//It will contain datasets for every facility in ids.

    let datasets = [];
    let firstDataset = true;

    for (const id of ids) {
        const newDatasets = await getPublicFacilityDatasets(id, dataType, firstDataset);
        datasets = datasets.concat(newDatasets);
        if(firstDataset) firstDataset = false;
    };

    return datasets;
}


export const getTypologyAverageAndDeviationDatasets = async (typology, dataType) => {
//Return a list of datasets ready to in Chart js.
//It will contain the datasets for the average and deviation of the facilities for one typology.

    try {
        const { data } = await api.req_getTypologyFacilities(typology);
        return getAverageAndDeviationDatasets(data.result, dataType, typology);
    } catch (error) {
        console.log(error);
    }
}

export const getPublicFacilitiesNames = async () => {
//Return a list with name and id for every facility

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
//Return a list with name and id for every facility in ids

    let names = [];
    for (const id of ids) {
        const name = await getPublicFacilityField(id, 'name');
        if(name) names.push({ id, name });
    };
    return names;
}

export const getInvisiblePublicFacilities = async () => {
 //Return and object with keys of facilities without coordiantes ids and value containing the name and empy coordinates.
 // { facilityId1: { name, coordiantes }, facilityId2 : { ... }, ... }

    try {
        const { data } = await api.req_getInvisiblePublicFacilities();
        return data.result.reduce((result, facility) => {
            result[facility._id] = {
                name: facility.name,
                coordinates: []
            };
            return result;
        }, {});
    } catch (error) {
        console.log(error);
    }
}

export const updatePublicFacility = async (id, dataType, concept, year, newValues) => {

    //Translate dataType. From catalan to english.
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
//Import a row of the csv file and 
//return a list of data that has not been imported to not overwrite (name, concept and dataTye for each).

    if (hasValuesCSV_row(row)){

        //Create newData object with the dada from csv row.
        const values = row.split(';');
        const typology = replaceAccentsAndCapitals(values[2])
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

        //If some data has not been imported return a list with it
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
//Import data from csv file and 
//return a list of data that has not been imported to not overwrite (name, concept and dataTye for each).

    let notImportedData = [];

    //First row is the header
    const startIndex = strFile.indexOf('\n');

    //Check if the file has 29 columns
    const nColumns = strFile.slice(0, startIndex).split(';').length;
    if (nColumns != 29){
        createAlert('Error a l\'importar dades', 'El format del fitxer no és correcte');
        return;
    }

    try {
        //Split in rows and import separately
        const rows = strFile.slice(startIndex + 1).split('\n');
        for (const row of rows){
            const notImportedDataFromRow = await importCSV_row(row, year);
            notImportedData = notImportedData.concat(notImportedDataFromRow);
        }  

        //Add id field to every element of the list to display report table in import action
        return addArrayObjectsIds(notImportedData);
    } catch (error) {
        createAlert('Error a l\'importar les dades');
        console.log(error);
    }
}

export const updateCoordinates = async (id, newCoords) => {

    //Check coordinates
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

export const getCSVReport = (datasets, dataType) => {
//Return the data from the chart to export in csv

    let unitDataType = '';
    if(dataType == CONSUMPTION) unitDataType  = 'kWh';
    else if(dataType == PRICE) unitDataType = '€';
    else if(dataType == AREA) unitDataType = `kWh/m${SUPERSCRIPT_TWO}`;

    //One value for each month
    const getValuesDataset = (dataset) => (
        dataset.data.reduce((result, currentValue, index) => {
            const month = `${MONTHS[index]} [${unitDataType}]`;
            return { ...result, [month]: currentValue}
        },{})
    );

    const data = [];
    datasets.forEach(dataset => {

        //Only displayed datasets
        if(!dataset.hidden){
            data.push({
                nom: dataset.name,
                concepte: dataset.concept,
                any: dataset.year,
                ...getValuesDataset(dataset)
            });
        }
    })
    return { data };
}