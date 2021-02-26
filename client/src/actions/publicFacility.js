import groupBy from 'lodash.groupby';

import * as api from '../api/index.js';

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
            let datasets = [];

            Object.keys(data.result.data).map((year) => {
                Object.keys(data.result.data[year]).map((concept) => {
                    datasets.push({
                        label: `${year} ${concept}`,
                        data: data.result.data[year][concept].consumption.map(value => (value == 0 ? null : value)),
                        borderColor: "#742774",
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