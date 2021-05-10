import swal from 'sweetalert';
import tinycolor from 'tinycolor2';

import { AREA, COLORS, CONCEPTS, CONSUMPTION, YEARS_LIST } from '../constants';

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

export const getFacilityDatasetData = (facilityData, dataValue, dataType, area) => {
    return facilityData[dataValue].map(value => {
        if(value == 0) return null;
        if(dataType == AREA) return value / area;
        return value;
    })
}

export const replaceAccentsAndCapitals = (word) => {
    let result = word.charAt(0).toLowerCase() + word.slice(1);
    return result.replace('à','a').replace('è','e').replace('é','e').replace('í','i').replace('ò','o').replace('ó','o').replace('ú','u');
}

export const getAverageDatasets = (facilities, dataType, typology) => {
    const descendantYears = YEARS_LIST.reverse();
    const name = `EQUIPAMENTS DE TIPOLOGIA ${typology.toUpperCase()}`
    let datasets = [];
    CONCEPTS.forEach((concept, darkenAmount) => {
        let indexColor = 0
        descendantYears.forEach((year) => {
            const arrays = getConceptYearArrays(facilities, concept, year, dataType);
            if(arrays.length){
                
                const average = getAverageArrays(arrays); 
                if(!average.every(value => value == 0)) {

                    const deviation = getDeviationArrays(arrays, average);
                    const color = COLORS[ indexColor % COLORS.length ];
    
                    datasets.push({
                        label: `${name} Mitjana ${concept} ${year}`,
                        id: `typology ${typology}`,
                        name: `${name}`,
                        concept: `${concept}`,
                        year: `${year}`,
                        data: average,
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: false,
                        borderDash: [10,5]
                    });
    
                    datasets.push({
                        label: `${name} Desviació max ${concept} ${year}`,
                        id: `typology ${typology}`,
                        name: `${name}`,
                        isDeviation: 'max',
                        concept: `${concept}`,
                        year: `${year}`,
                        data: deviation.map((value, index) => average[index] + value),
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: '+1',
                        backgroundColor: tinycolor(color).lighten(30),
                        borderDash: [10,5]
                    });
    
    
                    datasets.push({
                        label: `${name} Desviació min ${concept} ${year}`,
                        id: `typology ${typology}`,
                        name: `${name}`,
                        isDeviation: 'min',
                        concept: `${concept}`,
                        year: `${year}`,
                        data: deviation.map((value, index) => average[index] - value),
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: false,
                        borderDash: [10,5]
                    });
    
                    indexColor++;
                }
            }
        });
    });
    return datasets;
}

const getConceptYearArrays = (facilities, concept, year, dataType) => {
    const result = [];
    const valueType = dataType == AREA ? CONSUMPTION : dataType;
    facilities.forEach(facility => {
        if(facilityHasValues(facility, concept, year, dataType, valueType)){
            let newArray = facility.data[concept][year][valueType];
            if(dataType == AREA){
                newArray = newArray.map(value => value / facility.area);
            }
            result.push(newArray);
        }
    });
    return result;
}

const facilityHasValues = (facility, concept, year, dataType, valueType) => {
    if(facility.data[concept] && facility.data[concept][year] && facility.data[concept][year][valueType]){
        if(facility.data[concept][year][valueType].every(value => value == 0)) return false;
        if(dataType != AREA) return true;
        return facility.area;
    }
    return false;
}

const getAverageArrays = (arrays) => {
    let result = [];
    for(let indexMonth = 0; indexMonth < 12; indexMonth++){
        let addedValues = 0; 
        for(let indexArray = 0; indexArray < arrays.length; indexArray++){
            addedValues += arrays[indexArray][indexMonth];
        }
        const averageValue = Math.round(addedValues/arrays.length);
        result.push(averageValue);
    }
    return result;
}


const getDeviationArrays = (arrays, average) => {
    const result = [];
    for(let indexMonth = 0; indexMonth < 12; indexMonth++){
        let summation = 0;
        for(let indexArray = 0; indexArray < arrays.length; indexArray++){
            summation += Math.pow(arrays[indexArray][indexMonth] - average[indexMonth], 2);
        }
        const deviation = Math.sqrt(summation / (arrays.length - 1));
        result.push(Math.round(deviation));
    }
    return result;
}