import { useEffect } from 'react';
import groupBy from 'lodash.groupby';
import { Paper, Typography, Grid, Checkbox } from '@material-ui/core';

import './ChartLegend.css';

function ChartLegend({ data, setData }) {

    const conceptGroupedDatasets = groupBy(data.datasets, dataset => dataset.concept); 

    const handleLegendClick = (dataset) => {
        const index = data.datasets.findIndex((d) => d == dataset);
        const datasetsCopy = data.datasets;
        const dataCopy = datasetsCopy[index];
        dataCopy.hidden = !dataCopy.hidden;
        datasetsCopy[index] = dataCopy;
        setData({ labels: data.labels, datasets: datasetsCopy });
    }

    // return (
    //     <div className='chart-legend'>
    //         { Object.keys(conceptGroupedDatasets).map((concept, index) => (
    //             <Paper className='chart-legend-paper' key={index} elevation={3} >
    //                 <Typography variant='h5'>
    //                     {concept}
    //                 </Typography>
    //                 { conceptGroupedDatasets[concept].map((dataset, index) => (
    //                     <div className='chart-legend-item' key={index} onClick={() => handleLegendClick(dataset)}> 
    //                         <div style={{height: '15px', width: '40px', backgroundColor: dataset.borderColor, marginRight: '20px'}} />
    //                         <Typography variant='h6'>                                
    //                             {dataset.hidden ? <strike>{dataset.year}</strike> : dataset.year}
    //                         </Typography>
    //                     </div>
                        
    //                 ))}
    //             </Paper>
    //         ))}
    //     </div> 
    // )
    return (
        <div className='chart-legend' >
            <Paper className='chart-legend-paper' elevation={3}>
                <h2>Titol</h2>
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
                                    <div style={{height: '15px', width: '40px', backgroundColor: dataset.borderColor, marginLeft: '20px'}} />
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
