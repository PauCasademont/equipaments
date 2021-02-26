import { useEffect } from 'react';
import groupBy from 'lodash.groupby';
import { Paper, Typography, CircularProgress } from '@material-ui/core';

import './ChartLegend.css';

function ChartLegend({ data, setData }) {

    const yearsDatasets = groupBy(data.datasets, dataset => dataset.year); 

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
            { Object.keys(yearsDatasets).map((year, index) => (
                <Paper className='chart-legend-paper' key={index} elevation={3} >
                    <Typography variant='h5'>
                        {year}
                    </Typography>
                    { yearsDatasets[year].map((dataset, index) => (
                        <div className='chart-legend-item' key={index} onClick={() => handleLegendClick(dataset)}> 
                            <div style={{height: '15px', width: '40px', backgroundColor: dataset.borderColor, marginRight: '20px'}} />
                            <Typography variant='h6'>                                
                                {dataset.hidden ? <strike>{dataset.label}</strike> : dataset.label}
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
