import swal from 'sweetalert';
import tinycolor from 'tinycolor2';

import { COLORS } from '../constants';

export const createAlert = (title, text='', icon='error', button='ok') => {
    swal({ title, text, icon, button });
}

export const arrayStringToFloat = (arr) => {
    return arr.map( value => {
        const float = parseFloat(value);
        return float ? float : 0;
    });
}

export const inRangeLatitude = (num) => {
    return num >= -90 && num <= 90
}

export const inRangeLongitude = (num) => {
    return num >= -180 && num <= 180
}


const getDatasetData = (values, dataInfo) => {
    const { isAverage, area, dataType } = dataInfo;
    const divideByArea = !isAverage && area;

    if(isAverage){
        return values.map(value => value == 0 ? null : value);
    }               
    return values[dataType].map(value => {
        if(value == 0) return null;
        if(divideByArea) return value / area;
        return value;
    });  
}

export const getObjectDatasets = (object, dataInfo) => {
    const datasets = [];
    let hiddenLine = !dataInfo.firstDataset;

    Object.keys(object).map((concept, darkenAmount) => {

        Object.keys(object[concept]).reverse().map((year, index) => {
            const color = COLORS[ index % COLORS.length ];

            datasets.push({
                label: `${dataInfo.name} ${concept} ${year}`,
                id: dataInfo.id,
                publicFacility: `${dataInfo.name}`,
                concept: `${concept}`,
                year: `${year}`,
                data: getDatasetData(object[concept][year], dataInfo),
                borderColor: tinycolor(color).darken(darkenAmount*12),
                hidden: hiddenLine,
                fill: false,
                borderDash: dataInfo.isAverage ? [10,5] : null
            });

            if(!hiddenLine) hiddenLine = true;
        });
    });
    return datasets;
}

export const replaceAccentsAndCapitals = (word) => {
    let result = word.charAt(0).toLowerCase() + word.slice(1);
    return result.replace('à','a').replace('è','e').replace('é','e').replace('í','i').replace('ò','o').replace('ó','o').replace('ú','u');
}