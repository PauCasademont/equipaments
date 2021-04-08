import groupBy from 'lodash.groupby';
import tinycolor from 'tinycolor2';

import * as api from '../api/index.js';
import { COLORS, AREA, CONSUMPTION } from '../constants/index.js';

export const getPublicFalcilities =  async () => {
    try {
        const res = await api.req_getPublicFacilities();
        return groupBy(res.data.result, facility => facility.typology);
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

export const updatePublicFacility = async (id, data_type, concept, year, new_values) => {

}
