import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container, Paper } from '@material-ui/core';

import './Chart.css';
import { getPublicFacilityData } from '../../actions/publicFacility';
import { LABELS } from '../../constants/chart';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart() {
    const [data, setData] = useState({
        labels: [], datasets: []
    });
    const [title, setTitle] = useState('');  
    const { dataType, ids } = useParams(); 
    const id = ids.split(',')[0];

    const options = {
        legend: { display: false },
        title: { display: true, text: title, fontSize: 30 },
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
        getPublicFacilityData(id, dataType)

            .then((publicFacilityData) => {
                setData({labels: LABELS, datasets: publicFacilityData.datasets });
                setTitle(`Consum d'energia ${publicFacilityData.name}`);
            })
            .catch((error) => console.log(error));  

    }, []);

    return (
        <Container maxWidth='lg'>
            <div className='chart'>
                <ChartLegend 
                    data={data} 
                    setData={setData} 
                    ids={ids.split(',')} 
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
