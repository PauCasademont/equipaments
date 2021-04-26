import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container } from '@material-ui/core';

import './Chart.css';
import { getPublicFacilitiesDatasets, getTypologyAverageDatasets, getPublicFacilityField } from '../../actions/publicFacility';
import { LABELS, CONSUMPTION, PRICE, SUPERSCRIPT_TWO } from '../../constants';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart() {
    const [data, setData] = useState(null);
    const { dataType, ids } = useParams(); 
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

    useEffect(async () => {  
        const facilitiesDatasets = await getPublicFacilitiesDatasets(idsList, dataType);
        const typology = await getPublicFacilityField(idsList[0], 'typology')
        const typologyAverageDatasets = await getTypologyAverageDatasets(typology, dataType);
        setData({
            labels: LABELS,
            datasets: facilitiesDatasets.concat(typologyAverageDatasets)
        });
        
    }, []);

    return (
        data && 
        <Container maxWidth='lg'>
            <div>
                <ChartLegend 
                    data={data} 
                    setData={setData} 
                    ids={idsList} 
                    dataType={dataType} 
                />
                <Line 
                    data={data}                     
                    options={options} 
                    height={133}
                /> 
            </div>
        </Container>
    )
}

export default Chart
