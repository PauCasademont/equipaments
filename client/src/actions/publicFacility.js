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
            const { data: { result }} = await api.req_getPublicFacilityData(id);
            let datasets = [];
            
            result.data.map((year) => 
                year.annual_data.map((conceptData) => datasets.push({
                    label: `${year.year} ${conceptData.concept}`,
                    data: conceptData.consumption,
                    borderColor: "#742774"
                }))
            );

            return datasets
        } catch (error) {
            console.log(error);
        }
    }
}