import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { Paper, Button, Grid } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import Tippy from '@tippy.js/react';
import { CSVLink } from 'react-csv';
import tinycolor from 'tinycolor2';

import './ChartLegend.css';
import { getCSVReport } from '../../../actions/publicFacility';
import CustomAccordion from './CustomAccordion/CustomAccordion';

function ChartLegend({ data, setData, ids, dataType, handleExportPNG, chartTitle }) {
//Return the chart legend

    //Grouped chart datasets
    const [legendDatasets, setLegendDatasets] = useState({});

    //Ids of the facilities in the chart
    const [facilitiesIds, setFacilitiesIds] = useState(ids);

    const router = useHistory();
    const exportFileName = chartTitle.replaceAll(' ','_');


    useEffect(() => {
        //Group datasts by menuName, and for each menuName, group by concept
        let groupedDatasets = groupBy(data.datasets, dataset => dataset.menuName);
        Object.keys(groupedDatasets).forEach(facility => {
            groupedDatasets[facility] = groupBy(groupedDatasets[facility], dataset => dataset.concept);  
        });
        setLegendDatasets(groupedDatasets);
    },[]);

    const isDeviationMax = (dataset) => {
        return 'isDeviation' in dataset && dataset.isDeviation == 'max';
    }
    const getLabelsDisplayed = () => {
        const displayedDatasets = data.datasets.filter(dataset => !dataset.hidden);
        return displayedDatasets.map(dataset => dataset.label);
    }

    const handleLegendClick = (dataset) => {
        //Switch hidden value of the clicked dataset  
        const index = data.datasets.findIndex((d) => d == dataset);

        let datasetsCopy = data.datasets;
        let dataCopy = datasetsCopy[index];
        dataCopy.hidden = !dataCopy.hidden;
        datasetsCopy[index] = dataCopy;

        //If dataset is deviation max, switch the next that it's deviation min
        if(isDeviationMax(dataset)){
            datasetsCopy = data.datasets;
            dataCopy = datasetsCopy[index + 1];
            dataCopy.hidden = !dataCopy.hidden;
            datasetsCopy[index + 1] = dataCopy;
        }

        setData({ labels: data.labels, datasets: datasetsCopy });
    };


    const handleAddFacility = () => { 
        //Redirect to add facility page and pass the list facilities ids and displayed datasets
        const displayedDatasets = getLabelsDisplayed(); 
        router.push({
            pathname: `/map/add_facility/${dataType}`,
            state: { facilitiesIds, displayedDatasets }
        });
    };

    const handleChangeColor = (label, color) => {
        //Find dataset
        let datasetsCopy = data.datasets;
        const indexDataset = datasetsCopy.findIndex(dataset => dataset.label == label);
        if(indexDataset > -1){
            //Change color
            datasetsCopy[indexDataset].borderColor = color;
            //Change color deviation. Every deviation has two datasets and background color
            if(datasetsCopy[indexDataset].isDeviation){
                datasetsCopy[indexDataset + 1].borderColor = color;
                datasetsCopy[indexDataset].backgroundColor = tinycolor(color).lighten(30);
            }
            setData({ labels: data.labels, datasets: datasetsCopy });
        }
    }

    const removeFacilityData = (id) => {
        const datasetsHidden = data.datasets.map(dataset => dataset.id == id ? { ...dataset, hidden: true } : dataset);
        setData({ labels: data.labels, datasets: datasetsHidden });
    };

    const removeFacilityLegend = (facility) => {
        let legendDatasetsCopy = legendDatasets;
        delete legendDatasetsCopy[facility];
        setLegendDatasets(legendDatasetsCopy);
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

    const handleRemoveAccordion = (event, facility) => {
        event.stopPropagation();
        const id = data.datasets.find(dataset => dataset.menuName == facility).id;

        //Remove from the chart
        removeFacilityData(id);

        //Remove from the legend
        removeFacilityLegend(facility);

        //Remove from the url
        removeFacilityId(id);
    };

    return (
        <div className='chart-legend'>
            <Paper className='chart-legend-paper' elevation={3}>
                {/* Legend header */}
                <Grid container>
                    <Grid item sm={12} md={6} lg={3}>
                        <Tippy content='Afegeix un altre equipament per comparar dades'>
                            <Button 
                                className='chart-legend-btn' 
                                onClick={() => handleAddFacility()}
                                variant='contained' 
                                color='primary'
                            >
                                Afegir Equipament
                            </Button>
                        </Tippy>
                    </Grid>
                    <Grid item sm={12} md={6} lg={3}>
                        <Button 
                            className='chart-legend-btn'
                            variant='contained' 
                            color='primary' 
                        >
                            <CSVLink 
                                className='chart-legend-export-csv-link'
                                filename={`${exportFileName}.csv`}
                                {...getCSVReport(data.datasets, dataType)}
                            >
                                Exportar en CSV
                            </CSVLink>
                        </Button>
                    </Grid>
                    <Grid item sm={12} md={6} lg={3}>
                        <Button 
                            className='chart-legend-btn'
                            variant='contained' 
                            color='primary' 
                            onClick={() => handleExportPNG(exportFileName)}
                        >
                            Exportar en PNG
                        </Button>
                    </Grid>
                    <Grid item sm={12} md={6} lg={3}>
                        <Button 
                            className='chart-legend-btn' 
                            variant='outlined' 
                            color='primary' 
                            onClick={() => router.push('/')}
                        >
                            <ArrowBack/>
                            &nbsp; Torna al mapa
                        </Button>                   
                    </Grid>
                </Grid>
                {/* Legend accrodion menus */}
                { Object.keys(legendDatasets).map((accordionName, index) => (
                    <CustomAccordion
                        key={index}
                        accordionName={accordionName}
                        accordionDatasets={legendDatasets[accordionName]}
                        canRemove={index > 0}
                        defaultExpanded={index == 0}
                        handleRemoveAccordion={handleRemoveAccordion}
                        handleLegendClick={handleLegendClick}
                        handleChangeColor={handleChangeColor}
                    />
                ))}
            </Paper>
        </div>
    );
}

export default ChartLegend