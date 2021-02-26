import groupBy from 'lodash.groupby';
import tinycolor from 'tinycolor2';

import * as api from '../api/index.js';
import { colors } from '../constants/chart.js';

export const getPublicFalcilities =  async () => {
    try {
        const res = await api.req_getPublicFacilities();
        return groupBy(res.data.result, facility => facility.typology);
    } catch (error){
        console.log(error);
    }
}

export const getPublicFacilityDatasets = async (id) => {
    if(id){
        try {           
            const {data} = await api.req_getPublicFacilityData(id);
            const nColors = colors.length;
            let datasets = [];

            Object.keys(data.result.data).map((concept, darkenAmount) => {
                Object.keys(data.result.data[concept]).reverse().map((year, index) => {
                    const color = colors[nColors % (index + 1)];
                    datasets.push({
                        label: `${year}${concept}`,
                        concept: `${concept}`,
                        data: data.result.data[concept][year].consumption.map(value => (value == 0 ? null : value)),
                        borderColor: tinycolor(color).darken(darkenAmount*15),
                        hidden: false,
                        fill: false,
                        year: `${year}`
                    })
                })
            });
            
            return datasets
        } catch (error) {
            console.log(error);
        }
    }
}

export const getPublicFacilityName = async (id) => {
    if(id){
        try {
            const res =  await api.req_getPublicFacilityName(id);
            return res.data.result.name;
        } catch (error) {
            console.log(error);
        }
    }
}