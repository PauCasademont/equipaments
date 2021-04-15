import groupBy from 'lodash.groupby';
import tinycolor from 'tinycolor2';
import swal from 'sweetalert';

import * as api from '../api/index.js';
import { createAlert, arrayStringToFloat, inRangeLatitude, inRangeLongitude } from './utils';
import { COLORS, AREA, CONSUMPTION, PRICE, DATA_TYPES } from '../constants/index.js';

export const getMapPublicFalcilities =  async () => {
    try {
        const res = await api.req_getPublicFacilities();
        const visiblePublicFacilities = res.data.result.filter(facility => facility.coordinates.length > 0);        
        const typologyGrouped = groupBy(visiblePublicFacilities, facility => facility.typology);
        return typologyGrouped;
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

export const getPublicFacilityDatasets = async (id, dataType) => {
    if(id){
        try {           
            const {data} = await api.req_getPublicFacilityData(id);
            const name = data.result.name;
            let datasets = [];
            let area = null;

            if (dataType == AREA){
                area = data.result.area;
                dataType = CONSUMPTION;
            } 

            const getDatasetData = (concept, year) => {                
                return data.result.data[concept][year][dataType].map(value => 
                    (value == 0 ? null : (area ? value / area : value) )
                );  
            }
            
            Object.keys(data.result.data).map((concept, darkenAmount) => {
                Object.keys(data.result.data[concept]).reverse().map((year, index) => {
                    const color = COLORS[ index % COLORS.length ];
                    datasets.push({
                        label: `${name}${year}${concept}`,
                        publicFacility: `${name}`,
                        concept: `${concept}`,
                        year: `${year}`,
                        data: getDatasetData(concept, year),
                        borderColor: tinycolor(color).darken(darkenAmount*15),
                        hidden: false,
                        fill: false
                    })
                })
            });
            return datasets;
        } catch (error) {
            console.log(error);
        }
    }
}

export const getPublicFacilitiesDatasets = async (ids, dataType) => {
    let datasets = [];
    for (const id of ids) {
        const newDatasets = await getPublicFacilityDatasets(id, dataType);
        datasets = datasets.concat(newDatasets);
    };
    return datasets;
}

export const getPublicFacilitiesNames = async (ids) => {
    let result = [];
    const field = 'name';

    try {
        for (const id of ids) {
            const { data } = await api.req_getPublicFacilityField(id, field);
            result.push({
                id: data.result._id,
                name: data.result.name
            });
        }
        return result;
    } catch (error){
        console.log(error);
    }
}

export const getInvisibleFacilities = async () => {
    try {
        const res = await api.req_getPublicFacilities();
        const invisibleFacilities = res.data.result.filter(facility => facility.coordinates.length == 0);
        return invisibleFacilities.reduce((result, facility) => {
            result[facility._id] = {
                name: facility.name,
                coordinates: facility.coordinates
            };
            return result;
        }, {});     
    } catch (error){
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

const importCSV_row = async (row, year) => {
    if (row != '' && row[0] != ';'){
        const values = row.split(';');
        const typology = values[2].charAt(0).toLowerCase() + values[2].slice(1);
        const newData = {
            name: values[1],
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
        console.log('False');
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