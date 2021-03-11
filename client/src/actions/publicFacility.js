import groupBy from 'lodash.groupby';
import tinycolor from 'tinycolor2';

import * as api from '../api/index.js';
import { COLORS, AREA, CONSUMPTION } from '../constants/chart.js';

export const getPublicFalcilities =  async () => {
    try {
        const res = await api.req_getPublicFacilities();
        return groupBy(res.data.result, facility => facility.typology);
    } catch (error){
        console.log(error);
    }
}

export const getPublicFacilityData = async (id, dataType) => {
    if(id){
        try {           
            const {data} = await api.req_getPublicFacilityData(id);
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
                    const color = COLORS[ COLORS.length % (index + 1) ];
                    datasets.push({
                        label: `${year}${concept}`,
                        concept: `${concept}`,
                        data: getDatasetData(concept, year),
                        borderColor: tinycolor(color).darken(darkenAmount*15),
                        hidden: false,
                        fill: false,
                        year: `${year}`
                    })
                })
            });
            
            return { datasets, name: data.result.name }
        } catch (error) {
            console.log(error);
        }
    }
}

