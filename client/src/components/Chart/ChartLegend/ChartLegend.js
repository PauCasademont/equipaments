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
import { getPublicFacilitiesNames } from '../../../actions/publicFacility';

function ChartLegend({ data, setData, ids, dataType }) {
    const [publicFacilities, setPublicFacilities] = useState([]);
    const [selectedData, setSelectedData] = useState({
        publicFacility: '',
        datasets: null
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
        getPublicFacilitiesNames(ids)
        .then((result) => {
            setPublicFacilities(result);
            switchPublicFacility(result[result.length-1].name);            
        });     
    }, []);

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

    const handleRemoveFacility = () => {
      const idToRemove = publicFacilities.filter((publicFacility) => publicFacility.name == selectedData.publicFacility)[0].id;
      const index = ids.indexOf(idToRemove);
      ids.splice(index, 1);
      router.push(`/chart/${dataType}/${ids.join(',')}`);
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
                            { publicFacilities.map((publicFacility, index) => (
                                <MenuItem key={index} value={publicFacility.name}>
                                    {publicFacility.name}                                   
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
                    { publicFacilities.length > 1 &&
                    <Button 
                        className='chart-legend-button' 
                        onClick={() => handleRemoveFacility()}
                        variant='contained' 
                        color='secondary'
                    >
                        Treure Equipament
                    </Button> }
                </div>
                { selectedData.datasets && 
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
                                    {/* <input type='color' style={getCircleStyles(dataset.borderColor)} value={dataset.borderColor}/> */}
                                    <div 
                                        style={getCircleStyles(dataset.borderColor)} 
                                    />
                                </div>
                            ))}
                        </Grid>
                    ))}
                </Grid> }
            </Paper>
        </div>
    )
}


export default ChartLegend
