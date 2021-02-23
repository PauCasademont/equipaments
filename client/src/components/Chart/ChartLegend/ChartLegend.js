import groupBy from 'lodash.groupby';
import { Paper, Typography } from '@material-ui/core';

import './ChartLegend.css';

function ChartLegend({ chartRef, datasets }) {

    const yearsDatasets = groupBy(datasets, dataset => dataset.year);

    const handleClick = (dataset) => {
        let chartDataset = chartRef.current.props.data.datasets.filter(d => d == dataset)[0];
        if (chartDataset){
            chartDataset.hidden = !chartDataset.hidden;
            chartRef.current.chartInstance.update();
        }
    }

    return (
        <div className='chart-legend'>
            { Object.keys(yearsDatasets).map((year, index) => (
                <Paper className='chart-legend-paper' key={index} elevation={3} >
                    <Typography variant='h5'>
                        {year}
                    </Typography>
                    { yearsDatasets[year].map((dataset, index) => (
                        <div className='chart-legend-item' key={index} onClick={() => handleClick(dataset)}> 
                            <div style={{height: '15px', width: '40px', backgroundColor: dataset.borderColor, marginRight: '20px'}} />
                            <Typography variant='h6'>
                                {dataset.label}
                                {/* {dataset.hidden ? dataset.label : <strike>{dataset.label}</strike>} */}
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
