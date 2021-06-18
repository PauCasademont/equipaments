import swal from 'sweetalert';
import tinycolor from 'tinycolor2';

import { AREA, COLORS, CONCEPTS, CONSUMPTION, DESCENDANT_YEARS } from '../constants';

export const createAlert = (title, text='', icon='error', button='ok') => {
    swal({ title, text, icon, button });
}

export const arrayStringToInt = (arr) => {
    //Switch nul values to 0 in order to see the value in the chart
    return arr.map( value => {
        const result = parseInt(value);
        return result ? result : 0;
    });
}

export const inRangeLatitude = (num) => {
    return num >= -90 && num <= 90
}

export const inRangeLongitude = (num) => {
    return num >= -180 && num <= 180
}

export const hasNumber = (str) => {
    return /\d/.test(str);
}

export const getTypologyUserFormat = (typology) => {
//Return the typology string in uppercase with accents.
    const result = typology.toUpperCase();
    return result == 'EDUCACIO' ? 'EDUCACIÓ' : result;
}

export const addArrayObjectsIds = (array) => {
//Input: array of objects
//Output: the array with index filed in the objects

    return array.map((obj, index) => ({
        ...obj,
        id: index
    }));
}

export const getFacilityDatasetData = (facilityData, dataValue, isDataTypeArea, area) => {
    //DataValue can only be 'consumption' or 'price'
    return facilityData[dataValue].map(value => {
        return isDataTypeArea ? Math.round(value / area) : value;
    })
}

export const replaceAccentsAndCapitals = (word) => {
    let result = word.charAt(0).toLowerCase() + word.slice(1);
    return result.replace('à','a').replace('è','e').replace('é','e').replace('í','i').replace('ò','o').replace('ó','o').replace('ú','u');
}

export const remove = (list, value) => {
//Remove value from list
    const index = list.indexOf(value);
    if(index > -1){
        list.splice(index, 1);
    }
    return list;
}

export const add = (list, value) => {
//Add value in list
    return list.concat([value]);
}

export const getAverageAndDeviationDatasets = (facilities, dataType, typology) => {
//Return list of datasets ready to use in Chart js with the average and deviation of every facility in facilities.

    const menuName = `Mostra mitjanes i desviacions dels equipaments de tipologia ${getTypologyUserFormat(typology)}`
    let datasets = [];

    CONCEPTS.forEach((concept, darkenAmount) => {
        let indexColor = 0
        DESCENDANT_YEARS.forEach((year) => {
            //Get all values of concept, year and dataType of facilities
            const arrays = getConceptYearArrays(facilities, concept, year, dataType);

            if(arrays.length){

                //Get the average of the values
                const average = getAverageArrays(arrays); 

                //Check if the average is not null
                if(!average.every(value => value == 0)) {

                    //Get the deviation of the values
                    const deviation = getDeviationArrays(arrays, average);

                    let color = COLORS[ indexColor % COLORS.length ];

                    //Add the average dataset
                    datasets.push({
                        label: `${menuName} Mitjana ${concept} ${year}`,
                        id: `typology ${getTypologyUserFormat(typology)}`,
                        menuName,
                        name: `Mitjana tipologia ${typology}`,
                        concept: `${concept}`,
                        year: `${year}`,
                        typology: `${typology}`,
                        isAverage: true,
                        data: average,
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: false,
                        borderDash: [10,5]
                    });

                    color = COLORS[ (indexColor + 1) % COLORS.length ];
                    
                    //Add deviation max values (average + devaition) dataset
                    //Fill '+1' menas that the chart will be colored (backgroundColor) from this dataset to the next one (min deviation)
                    datasets.push({
                        label: `${menuName} Desviació max ${concept} ${year}`,
                        id: `typology ${getTypologyUserFormat(typology)}`,
                        menuName,
                        name: `Desviació max tipologia ${typology}`,
                        isDeviation: 'max',
                        concept: `${concept}`,
                        typology: `${typology}`,
                        year: `${year}`,
                        data: deviation.map((value, index) => average[index] + value),
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: '+1',
                        backgroundColor: tinycolor(color).lighten(30),
                        borderDash: [10,5]
                    });
    
                    //Add deviation min values (average - devaition) dataset.
                    datasets.push({
                        label: `${menuName} Desviació min ${concept} ${year}`,
                        id: `typology ${getTypologyUserFormat(typology)}`,
                        menuName,
                        name: `Desviació min tipologia ${typology}`,
                        isDeviation: 'min',
                        concept: `${concept}`,
                        year: `${year}`,
                        typology: `${typology}`,
                        data: deviation.map((value, index) => average[index] - value),
                        borderColor: tinycolor(color).darken(darkenAmount*12),
                        hidden: true,
                        fill: false,
                        borderDash: [10,5]
                    });
    
                    indexColor += 2;
                }
            }
            // console.log('year: ',year);
            // datasets.forEach(dataset => {if(dataset.concept == concept) console.log(dataset.year)});
            // console.log('\n');
        });
    });
    return datasets;
}

const getConceptYearArrays = (facilities, concept, year, dataType) => {
//Return list of arrays of concept, year and dataType for each facility in facilities

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
//Return true if facility has values of concept, year and dataType. If valueType is area then it has to have area > 0.

    if(facility.data[concept] && facility.data[concept][year] && facility.data[concept][year][valueType]){
        if(facility.data[concept][year][valueType].every(value => value == 0)) return false;
        if(dataType != AREA) return true;
        return facility.area;
    }
    return false;
}

const getAverageArrays = (arrays) => {
//Return the average of every month in arrays

    let result = [];
    for(let indexMonth = 0; indexMonth < 12; indexMonth++){
        let addedValues = 0; 

        //Sum values of indexMonth
        for(let indexArray = 0; indexArray < arrays.length; indexArray++){
            addedValues += arrays[indexArray][indexMonth];
        }

        //Add the average of indexMonth
        const averageValue = Math.round(addedValues/arrays.length);
        result.push(averageValue);
    }
    return result;
}


const getDeviationArrays = (arrays, average) => {
//Return the deviation of every month in arrays
//Formula: squareRoot( Σ(Xi - x̄)/ N) being Xi = month value of arrays[i], x̄ = average for that month and N = number of arrays.

    const result = [];
    for(let indexMonth = 0; indexMonth < 12; indexMonth++){
        let summation = 0;

        //Add devaition for indexMonth
        for(let indexArray = 0; indexArray < arrays.length; indexArray++){
            summation += Math.pow(arrays[indexArray][indexMonth] - average[indexMonth], 2);
        }
        const deviation = Math.sqrt(summation / (arrays.length));
        result.push(Math.round(deviation));
    }
    return result;
}