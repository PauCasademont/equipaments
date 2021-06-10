import { Typography, Paper } from '@material-ui/core';
import { BorderRight } from '@material-ui/icons';
import React from 'react';
import { Line } from 'react-chartjs-2';

import './ExportChart.css';

const ExportChart = React.forwardRef(({ data, options }, ref) => {
//Return a hidden chart with a custom legend to export it in PNG

    const getLegendDatasetName = (dataset) => {
        if(dataset.isAverage) return `Mitjana dels equipaments de tipologia: ${dataset.typology}`;
        if(dataset.isDeviation) return `Desviació estàndard dels equipaments de tipologia: ${dataset.typology}`;
        return dataset.name;
    };

    const showDatasetInLegend = (dataset) => {
        //To not repeat min and max deviation in the legend
        if(dataset?.isDeviation == 'min') return false;
        return !dataset.hidden;
    };

    return (
        <div ref={ref} id='export_chart' style={{ visibility: 'hidden', marginTop: '-1000px' }}>
            {/* Export chart */}
            <Line 
                data={data}                     
                options={options} 
                height={133}
            /> 
            {/* Export chart legend */}
            <div className='export-chart-legend'>
                { data.datasets.map((dataset, index) => (
                    showDatasetInLegend(dataset) &&
                    <div key={index} className='export-chart-legend-item'>
                        <div className='export-chart-legend-circle' style={{ background: dataset.borderColor }}>
                            {/* Apply discontinous style if dataset is average or deviation */}
                            { dataset.borderDash &&
                                Array(10).fill().map((_, index) => (
                                    <div key={index} className={ index % 2 == 0 ? 'export-chart-legend-circle-segment-color' : 'export-chart-legend-circle-segment-white'}/>
                                ))
                            }
                        </div>
                        <Typography key={index} variant='body2'>
                            {getLegendDatasetName(dataset)} | {dataset.concept} {dataset.year}
                        </Typography>
                    </div>
                    
                ))}
            </div>
        </div>
    )
});

export default ExportChart
