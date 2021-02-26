import { useEffect } from 'react';
import groupBy from 'lodash.groupby';
import { Paper, Typography, CircularProgress } from '@material-ui/core';

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

    return (
        <div className='chart-legend'>
            { Object.keys(conceptGroupedDatasets).map((concept, index) => (
                <Paper className='chart-legend-paper' key={index} elevation={3} >
                    <Typography variant='h5'>
                        {concept}
                    </Typography>
                    { conceptGroupedDatasets[concept].map((dataset, index) => (
                        <div className='chart-legend-item' key={index} onClick={() => handleLegendClick(dataset)}> 
                            <div style={{height: '15px', width: '40px', backgroundColor: dataset.borderColor, marginRight: '20px'}} />
                            <Typography variant='h6'>                                
                                {dataset.hidden ? <strike>{dataset.year}</strike> : dataset.year}
                            </Typography>
                        </div>
                        
                    ))}
                </Paper>
            ))}
        </div> 
    )
}
    // <button onClick={getKeys()}>Click</button>

export default ChartLegend
