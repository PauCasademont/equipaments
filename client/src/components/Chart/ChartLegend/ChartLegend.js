import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { Paper, Button, Grid, Menu, IconButton, MenuItem } from '@material-ui/core';
import { ArrowBack, GetApp } from '@material-ui/icons';
import Tippy from '@tippy.js/react';
import { CSVLink } from 'react-csv';

import './ChartLegend.css';
import { getCSVReport } from '../../../actions/publicFacility';
import CustomAccordion from './CustomAccordion/CustomAccordion';

function ChartLegend({ data, setData, ids, dataType, handleExportPNG, chartTitle }) {
    const [legendDatasets, setLegendDatasets] = useState({});
    const [facilitiesIds, setFacilitiesIds] = useState(ids);
    const [anchorExportMenu, setAnchorExportMenu] = useState(null);
    const router = useHistory();
    const exportFileName = chartTitle.replaceAll(' ','_');
    useEffect(() => {
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
        removeFacilityData(id);
        removeFacilityLegend(facility);
        removeFacilityId(id);
    };

    return (
        <div className='chart-legend'>
            <Paper className='chart-legend-paper' elevation={3}>
                <Grid container>
                    <Grid item sm={12} md={6} lg={4}>
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
                    <Grid item xs={12} sm={6} md={5}>
                        <Tippy content='Exporta el gràfic en format CSV o PNG'>
                            <IconButton 
                                className='chart-legend-btn chart-legend-export-btn'
                                onClick={(event) => setAnchorExportMenu(event.currentTarget)}
                                variant='contained' 
                                color='primary'
                                aeia-controls='exportMenu'
                                aria-haspopup='true'
                            >
                                <GetApp/>
                            </IconButton>
                        </Tippy>
                        <Menu
                            id='exportMenu'
                            keepMounted
                            anchorEl={anchorExportMenu}
                            open={Boolean(anchorExportMenu)}
                            onClose={() => setAnchorExportMenu(null)}
                        >
                            <MenuItem onClick={() => console.log('csv')}>
                                <CSVLink 
                                    className='chart-legend-export-csv-link'
                                    filename={`${exportFileName}.csv`}
                                    {...getCSVReport(data.datasets, dataType)}
                                >
                                    Exportar en CSV
                                </CSVLink>
                            </MenuItem>
                            <MenuItem onClick={() => handleExportPNG(exportFileName)}>
                                Exportar en PNG
                            </MenuItem>
                        </Menu>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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