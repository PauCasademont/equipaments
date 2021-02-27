import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container } from '@material-ui/core';

import './Chart.css';
import { getPublicFacilityDatasets, getPublicFacilityName } from '../../actions/publicFacility';
import { LABELS } from '../../constants/chart';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart({ dataType }) {
    const [data, setData] = useState({
        labels: [], datasets: []
    });
    const [title, setTitle] = useState('');   
    const { id } = useParams(); 
    

    useEffect(() => {   
        getPublicFacilityDatasets(id, dataType)
            .then((datasets) => {
                setData({labels: LABELS, datasets });
            })
            .catch((error) => console.log(error));

        getPublicFacilityName(id)
            .then((name)=> {
                setTitle(`Consum d'energia ${name}`);
            })
            .catch((error) => console.log(error));     
    }, []);

    return (
        <Container maxWidth='lg'>
            <div className='chart'>
                <ChartLegend data={data} setData={setData} />
                <Line 
                    data={data}                     
                    options={{
                        legend: { display: false },
                        title: { display: true, text: title, fontSize: 30 },
                        responsive: true                       
                    }} 
                /> 
            </div>
        </Container>
    )
}

export default Chart
