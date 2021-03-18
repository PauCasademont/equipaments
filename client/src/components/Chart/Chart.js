import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container, Paper } from '@material-ui/core';

import './Chart.css';
import { getPublicFacilitiesDatasets } from '../../actions/publicFacility';
import { LABELS } from '../../constants/chart';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart() {
    const [data, setData] = useState({
        labels: [], datasets: []
    });
    const { dataType, ids } = useParams(); 
    const idsList = ids.split(',');

    const options = {
        legend: { display: false },
        // title: { display: true, text: title, fontSize: 30 },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        responsive: true                       
    }

    useEffect(() => {  
        getPublicFacilitiesDatasets(idsList, dataType)
        .then((datasets) => {
            setData({
                labels: LABELS,
                datasets 
            });
        })
    }, []);

    return (
        <Container maxWidth='lg'>
            <div className='chart'>
                <ChartLegend 
                    data={data} 
                    setData={setData} 
                    ids={idsList} 
                    dataType={dataType} 
                />
                <Line 
                    data={data}                     
                    options={options} 
                /> 
            </div>
        </Container>
    )
}

export default Chart
