import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { Paper, Button, IconButton } from '@material-ui/core';
import { ArrowBack, GetApp } from '@material-ui/icons';

import './ChartLegend.css';
import CustomAccordion from './CustomAccordion/CustomAccordion';

function ChartLegend({ data, setData, ids, dataType, handleExportPNG }) {
    const [legendFacilities, setLegendFacilities] = useState({});
    const [facilitiesIds, setFacilitiesIds] = useState(ids);
    const router = useHistory();

    useEffect(() => {
        let groupedFacilities = groupBy(data.datasets, dataset => dataset.name);
        Object.keys(groupedFacilities).forEach(facility => {
            groupedFacilities[facility] = groupBy(groupedFacilities[facility], dataset => dataset.concept);  
        });
        setLegendFacilities(groupedFacilities);
    },[]);

    const isDeviationMax = (dataset) => {
        return 'isDeviation' in dataset && dataset.isDeviation == 'max';
    }

    const getLabelsDisplayed = () => {
        const displayedDatasets = data.datasets.filter(dataset => !dataset.hidden);
        return displayedDatasets.map(dataset => dataset.label);
    }

    const handleLegendClick = (dataset) => {
        const index = data.datasets.findIndex((d) => d == dataset);

        let datasetsCopy = data.datasets;
        let dataCopy = datasetsCopy[index];
        dataCopy.hidden = !dataCopy.hidden;
        datasetsCopy[index] = dataCopy;

        if(isDeviationMax(dataset)){
            datasetsCopy = data.datasets;
            dataCopy = datasetsCopy[index + 1];
            dataCopy.hidden = !dataCopy.hidden;
            datasetsCopy[index + 1] = dataCopy;
        }

        setData({ labels: data.labels, datasets: datasetsCopy });
    };


    const handleAddFacility = () => { 
        const displayedDatasets = getLabelsDisplayed(); 
        router.push({
            pathname: `/map/add_facility/${dataType}`,
            state: { facilitiesIds, displayedDatasets }
        });
    };

    const handleChangeColor = (label, color) => {
        let datasetsCopy = data.datasets;
        const indexDataset = datasetsCopy.findIndex(dataset => dataset.label == label);
        if(indexDataset > -1){
            datasetsCopy[indexDataset].borderColor = color;
            setData({ labels: data.labels, datasets: datasetsCopy });
        }
    }

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
        const index = facilitiesIds.indexOf(id);
        if(index > -1) {
            let facilitiesIdsCopy = facilitiesIds;
            facilitiesIdsCopy.splice(index, 1);
            setFacilitiesIds(facilitiesIdsCopy);

            const strIds = facilitiesIds.join(',');
            router.push(`/chart/consumption/${strIds}`);
        }
    }

    const handleRemoveFacility = (event, facility) => {
        event.stopPropagation();
        const id = data.datasets.find(dataset => dataset.name == facility).id;
        removeFacilityData(id);
        removeFacilityLegend(facility);
        removeFacilityId(id);
    };

    return (
        <div className='chart-legend'>
            <Paper className='chart-legend-paper' elevation={3}>
                <div className='chart-legend-bar'>
                    <div>
                        <Button 
                            className='chart-legend-add-btn' 
                            onClick={() => handleAddFacility()}
                            variant='contained' 
                            color='primary'
                        >
                            Afegir Equipament
                        </Button>
                        <Button 
                            onClick={() => handleExportPNG()}
                            variant='contained' 
                            color='primary'
                        >
                            <GetApp/> &nbsp; Descarrega el gràfic en PNG
                        </Button>
                    </div>
                    <Button 
                        className='chart-legend-return-btn' 
                        variant='outlined' 
                        color='primary' 
                        onClick={() => router.push('/')}
                    >
                        <ArrowBack/>
                        &nbsp; Torna al mapa
                    </Button>                   
                </div>
                { Object.keys(legendFacilities).map((facility, index) => (
                    <CustomAccordion
                        key={index}
                        facilityName={facility}
                        facility={legendFacilities[facility]}
                        canRemove={index > 0}
                        defaultExpanded={index == 0}
                        handleRemoveFacility={handleRemoveFacility}
                        handleLegendClick={handleLegendClick}
                        handleChangeColor={handleChangeColor}
                    />
                ))}
            </Paper>
        </div>
    );
}

export default ChartLegend