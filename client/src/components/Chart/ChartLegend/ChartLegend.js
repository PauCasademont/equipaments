import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { ExpandMore, RemoveCircleOutline } from '@material-ui/icons'; 
import {
    Paper, 
    Typography, 
    Grid, 
    Checkbox, 
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton
    } from '@material-ui/core';

import './ChartLegend.css';

function ChartLegend({ data, setData, ids, dataType }) {
    const [legendFacilities, setLegendFacilities] = useState({});
    const router = useHistory();

    useEffect(() => {
        let groupedFacilities = groupBy(data.datasets, dataset => dataset.publicFacility);
        Object.keys(groupedFacilities).forEach(facility => {
            groupedFacilities[facility] = groupBy(groupedFacilities[facility], dataset => dataset.concept);
        });
        setLegendFacilities(groupedFacilities);
    },[]);

    const getCircleStyles = (color = '#CACFD2') => ({
        height: '25px', 
        width: '25px', 
        backgroundColor: color, 
        borderRadius:'50%', 
        marginLeft: '17px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        zIndex: '5'
    });

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
            state: { ids }
        });
    };

    const handleRemoveFacility = (event, facility) => {
        event.stopPropagation();
        const id = data.datasets.find(dataset => dataset.publicFacility == facility).id;
        const index = ids.indexOf(id);
        let newIds = ids;
        newIds.splice(index, 1);
        const idsString = newIds.join(',');
        router.push(`/chart/${dataType}/${idsString}`);
        window.location.reload(false);
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
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography variant='body1'>
                                {facility}
                            </Typography>
                            <IconButton 
                                className='chart-legend-remove-btn' 
                                onClick={(event) => handleRemoveFacility(event, facility)}
                            >
                                <RemoveCircleOutline />
                            </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                { Object.keys(legendFacilities[facility]).map((concept, conceptIndex) => (
                                    <Grid item xs={12} sm={6} md={3} key={conceptIndex}>
                                        <Typography variant='h5'>
                                            {concept}
                                        </Typography>
                                        { legendFacilities[facility][concept].map((dataset, datasetIndex) => (
                                            <div className='chart-legend-item' key={datasetIndex}>
                                                <Checkbox
                                                    className='chart-legend-checkbox'
                                                    checked={!dataset.hidden}
                                                    color='primary'
                                                    onClick={() => handleLegendClick(dataset)}
                                                />
                                                <Typography variant='h6'>
                                                    {dataset.year}
                                                </Typography>
                                                <div style={getCircleStyles(dataset.borderColor)}/>
                                            </div>
                                        ))}
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>
        </div>
    );
}

export default ChartLegend