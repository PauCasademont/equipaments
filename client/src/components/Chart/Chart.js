import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Grid } from '@material-ui/core';
import { exportComponentAsPNG } from 'react-component-export-image';
import { useLocation } from 'react-router-dom';

import './Chart.css';
import { 
    getPublicFacilitiesDatasets, 
    getTypologyAverageDatasets, 
    getPublicFacilityField, 
    getPublicFacilitiesNamesFromIds
} from '../../actions/publicFacility';
import { LABELS, CONSUMPTION, PRICE, SUPERSCRIPT_TWO, DATA_TYPES, AREA } from '../../constants';
import ChartLegend from './ChartLegend/ChartLegend';
import ExportChart from './ExportChart/ExportChart';

function Chart({ displayedDatasets = [] }) {
    const [data, setData] = useState(null);
    const [chartTitle, setChartTitle] = useState('');
    const exportChartRef = useRef();
    const { dataType, ids } = useParams(); 
    const idsList = ids.split(',');
    const location = useLocation();

    const options = {
        legend: { display: false },
        title: { display: true, text: chartTitle, fontSize: 22 },
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

    useEffect(() => {
        let chartType = DATA_TYPES[dataType];
        if(dataType == AREA) chartType= 'Consum per m' + SUPERSCRIPT_TWO;

        getPublicFacilitiesNamesFromIds(idsList)
        .then(facilities => {
            const names  = facilities.map(facility => facility.name);
            const title = `${chartType} ${idsList.length > 1 ? 'equipaments: ' : ''} ${names.join(', ')}`;
            setChartTitle(title);
        });
    },[location]);



    const handleExportPNG = (fileName) => {
        exportComponentAsPNG(exportChartRef, {
            fileName,
            html2CanvasOptions: {
                onclone: (clonedDoc) => {
                    clonedDoc.getElementById('export_chart').style.visibility = 'visible';
                }
            }
        })
    }

    return (
        data && 
        <Grid container justify='center' id='chartContainer'>
            <Grid item xs={10} sm={6}>
                <ChartLegend 
                    data={data} 
                    setData={setData} 
                    ids={idsList} 
                    dataType={dataType}
                    chartTitle={chartTitle} 
                    handleExportPNG={handleExportPNG}
                />
                <Line 
                    data={data}                     
                    options={options} 
                    height={133}
                /> 
                <ExportChart data={data} options={options} ref={exportChartRef}/>
            </Grid>
        </Grid>
    )
}

export default Chart
