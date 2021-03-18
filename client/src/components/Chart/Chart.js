import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container, Button } from '@material-ui/core';

import './Chart.css';
import { getPublicFacilitiesDatasets } from '../../actions/publicFacility';
import { LABELS, CONSUMPTION, PRICE, SUPERSCRIPT_TWO } from '../../constants';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart() {
    const [data, setData] = useState({
        labels: [], datasets: []
    });
    const { dataType, ids } = useParams(); 
    const router = useHistory();
    const idsList = ids.split(',');

    const options = {
        legend: { display: false },
        // title: { display: true, text: title, fontSize: 30 },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: (value) => {
                        let unit = '';
                        if (dataType==CONSUMPTION) unit = 'Kw';
                        else if (dataType==PRICE) unit = '€';
                        else unit = `Kw/m${SUPERSCRIPT_TWO}`
                        return `${value} ${unit}`;
                    }
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
            <div className='chart-bottom-bar'>
                <Button variant='contained' color='primary' onClick={() => router.push('/')}>
                    TORNA AL MAPA
                </Button>
            </div>
        </Container>
    )
}

export default Chart
