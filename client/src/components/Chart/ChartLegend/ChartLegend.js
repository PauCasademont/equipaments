import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { Paper, Button } from '@material-ui/core';

import './ChartLegend.css';
import CustomAccordion from './CustomAccordion/CustomAccordion';
import { getPublicFacilityField } from '../../../actions/publicFacility';

function ChartLegend({ data, setData, ids, dataType }) {
    const [legendFacilities, setLegendFacilities] = useState({});
    const [facilitiesIds, setFacilitiesIds] = useState(ids);
    const router = useHistory();

    useEffect(() => {
        let groupedFacilities = groupBy(data.datasets, dataset => dataset.publicFacility);
        Object.keys(groupedFacilities).forEach(facility => {
            groupedFacilities[facility] = groupBy(groupedFacilities[facility], dataset => dataset.concept);
        });
        setLegendFacilities(groupedFacilities);

        getPublicFacilityField(facilitiesIds[0], 'typology')
        .then(typology => console.log(typology));
    },[]);

    const handleLegendClick = (dataset) => {
        const index = data.datasets.findIndex((d) => d == dataset);
        let datasetsCopy = data.datasets;
        let dataCopy = datasetsCopy[index];
        dataCopy.hidden = !dataCopy.hidden;
        datasetsCopy[index] = dataCopy;
        setData({ labels: data.labels, datasets: datasetsCopy });
    };

    const handleAddFacility = () => {     
        router.push({
            pathname: `/map/add_facility/${dataType}`,
            state: { facilitiesIds }
        });
    };

    const removeFacilityData = (id) => {
        const newDatasets = data.datasets.filter(dataset => dataset.id != id);
        setData({ labels: data.labels, datasets: newDatasets });
    };

    const removeFacilityLegend = (facility) => {
        let legendFacilitiesCopy = legendFacilities;
        delete legendFacilitiesCopy[facility];
        setLegendFacilities(legendFacilitiesCopy);
    };

    const removeFacilityId = (id) => {
        let facilitiesIdsCopy = facilitiesIds;
        const index = facilitiesIdsCopy.indexOf(id);
        if(index > -1) facilitiesIdsCopy.splice(index, 1);
        setFacilitiesIds(facilitiesIdsCopy);
    }

    const handleRemoveFacility = (event, facility) => {
        event.stopPropagation();
        const id = data.datasets.find(dataset => dataset.publicFacility == facility).id;
        removeFacilityData(id);
        removeFacilityLegend(facility);
        removeFacilityId(id);
    };

    return (
        <div className='chart-legend'>
            <Paper className='chart-legend-paper' elevation={3}>
                <div className='chart-legend-bar'>
                    <Button 
                        className='chart-legend-button' 
                        onClick={() => handleAddFacility()}
                        variant='contained' 
                        color='primary'
                    >
                        Afegir Equipament
                    </Button>
                   
                </div>
                { Object.keys(legendFacilities).map((facility, index) => (
                    <CustomAccordion
                        key={index}
                        facilityName={facility}
                        facilities={legendFacilities[facility]}
                        canRemove={Object.keys(legendFacilities).length > 1}
                        handleRemoveFacility={handleRemoveFacility}
                        handleLegendClick={handleLegendClick}
                    />
                ))}
            </Paper>
        </div>
    );
}

export default ChartLegend