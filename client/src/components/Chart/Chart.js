import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Container } from '@material-ui/core';
import { saveAs } from 'file-saver';

import './Chart.css';
import { getPublicFacilitiesDatasets, getTypologyAverageDatasets, getPublicFacilityField } from '../../actions/publicFacility';
import { LABELS, CONSUMPTION, PRICE, SUPERSCRIPT_TWO, DATA_TYPES, AREA } from '../../constants';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart({ facilityName, displayedDatasets = [] }) {
    const [data, setData] = useState(null);
    const { dataType, ids } = useParams(); 
    const idsList = ids.split(',');

    const getChartTitle = () => {
        let tipusGrafic = DATA_TYPES[dataType];
        if(dataType == AREA) tipusGrafic= 'Consum per m' + SUPERSCRIPT_TWO;

        if(idsList.length > 1) return `Gràfic ${tipusGrafic}`;
        return `${tipusGrafic} ${facilityName}`;
    }

    const options = {
        legend: { display: false },
        title: { display: true, text: getChartTitle(), fontSize: 30 },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,                   
                    callback: (value) => {
                        let unit = '';
                        if (dataType==CONSUMPTION) unit = 'kWh';
                        else if (dataType==PRICE) unit = '€';
                        else unit = `kWh/m${SUPERSCRIPT_TWO}`
                        return `${value} ${unit}`;
                    }
                },
                gridLines: {
                    z: 99
                }
            }],
            xAxes: [{
                gridLines: {
                    z: 99
                }
            }]
        },
        responsive: true                       
    }

    const getTypologyDatasets = async () => {
        const typology = await getPublicFacilityField(idsList[0], 'typology');
        return await getTypologyAverageDatasets(typology, dataType);
    }

    const setDisplayedDatasets = (datasets) => {
        for(const displayedDataset of displayedDatasets){
            const index = datasets.findIndex(dataset => dataset.label == displayedDataset);
            if(index >= 0){
                datasets[index].hidden = false;
            }
        }
        return datasets;
    }

    useEffect(async () => {  
        let facilitiesDatasets = await getPublicFacilitiesDatasets(idsList, dataType);  

        if(facilitiesDatasets.length > 0){
            const typologyAverageDatasets = await getTypologyDatasets();
            facilitiesDatasets = facilitiesDatasets.concat(typologyAverageDatasets);
        }
        const datasets = setDisplayedDatasets(facilitiesDatasets);
        setData({
            labels: LABELS,
            datasets
        });        
    }, []);

    const handleExportPNG = () => {
        const canvasSave = document.getElementById('line_chart');
        canvasSave.toBlob(blob => {
            const fileName = getChartTitle();
            saveAs(blob, fileName);
        })
    }

    return (
        data && 
        <Container maxWidth='md'>
                <ChartLegend 
                    data={data} 
                    setData={setData} 
                    ids={idsList} 
                    dataType={dataType} 
                    handleExportPNG={handleExportPNG}
                />
                <Line 
                    id='line_chart'
                    data={data}                     
                    options={options} 
                    height={133}
                /> 
        </Container>
    )
}

export default Chart
