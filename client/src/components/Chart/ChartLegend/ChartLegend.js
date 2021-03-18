import { useEffect, useState } from 'react';
import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { 
    Paper, 
    Typography, 
    Grid, 
    Checkbox, 
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
    } from '@material-ui/core';

import './ChartLegend.css';
import { getPublicFacilityField } from '../../../actions/publicFacility';

function ChartLegend({ data, setData, ids, dataType }) {
    const [publicFacilities, setPublicFacilities] = useState([]);
    const [selectedData, setSelectedData] = useState({
        publicFacility: '',
        datasets: []
    });
    const router = useHistory();

    const switchPublicFacility = (name) => {
        const filteredDatasets = data.datasets.filter((dataset) => dataset.publicFacility == name);
        const groupedDatasets = groupBy(filteredDatasets, dataset => dataset.concept);
        setSelectedData({
            publicFacility: name,
            datasets: groupedDatasets
        });
    }

    useEffect(() => {
        getPublicFacilityField(ids, 'name')
        .then((names) => {
            setPublicFacilities(names);
            switchPublicFacility(names[0]);
        });
        
    }, []);

    const getCircleStyles = (color = '#CACFD2') => ({
        height: '25px', 
        width: '25px', 
        backgroundColor: color, 
        borderRadius:'50%', 
        marginLeft: '17px',
        cursor: 'pointer'
    }) 

    const handleLegendClick = (dataset) => {
        const index = data.datasets.findIndex((d) => d == dataset);
        const datasetsCopy = data.datasets;
        const dataCopy = datasetsCopy[index];
        dataCopy.hidden = !dataCopy.hidden;
        datasetsCopy[index] = dataCopy;
        setData({ labels: data.labels, datasets: datasetsCopy });
    }

    const handleAddFacility = () => {
        router.push({
            pathname: `/map/add_facility/${dataType}`,
            state: { ids }
        });
    }

  
    return (
        <div className='chart-legend' >
            <Paper className='chart-legend-paper' elevation={3}>
                <div className='chart-legend-bar'>
                    <FormControl className='chart-legend-form'>
                        <InputLabel id='publicFacility-select-label'>Equipament</InputLabel>
                        <Select
                            className='chart-legend-select'
                            labelId='publicFacility-select-label'
                            value={selectedData.publicFacility}
                            onChange={(event) => switchPublicFacility(event.target.value)}
                        >
                            { publicFacilities.map((name, index) => (
                                <MenuItem key={index} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button 
                        className='chart-legend-button' 
                        onClick={() => handleAddFacility()}
                        variant='contained' 
                        color='primary'
                    >
                        Afegir Equipament
                    </Button>
                </div>
                <Grid container spacing={3}>
                    { Object.keys(selectedData.datasets).map((concept, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Typography variant='h5'>
                                {concept}
                            </Typography>
                            { selectedData.datasets[concept].map((dataset, index) => (
                                <div className='chart-legend-item' key={index} >
                                    <Checkbox 
                                        className='chart-legend-checkbox' 
                                        checked={!dataset.hidden}
                                        color='primary' 
                                        onClick={() => handleLegendClick(dataset)}
                                    />
                                    <Typography variant='h6'>                                
                                        {dataset.year}
                                    </Typography>
                                    <div 
                                        style={getCircleStyles(dataset.borderColor)} 
                                    />
                                </div>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </div>
    )
}


export default ChartLegend
