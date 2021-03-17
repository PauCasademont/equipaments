import groupBy from 'lodash.groupby';
import { useHistory } from 'react-router-dom';
import { Paper, Typography, Grid, Checkbox, Button } from '@material-ui/core';

import './ChartLegend.css';

function ChartLegend({ data, setData, ids, dataType }) {
    const router = useHistory();
    const conceptGroupedDatasets = groupBy(data.datasets, dataset => dataset.concept); 

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
                    <h2>Titol</h2>
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
                    { Object.keys(conceptGroupedDatasets).map((concept, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Typography variant='h5'>
                                {concept}
                            </Typography>
                            { conceptGroupedDatasets[concept].map((dataset, index) => (
                                <div className='chart-legend-item' key={index} >
                                    <Checkbox 
                                        className='chart-legend-checkbox' 
                                        defaultChecked
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
