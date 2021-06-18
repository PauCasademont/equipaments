import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Grid } from '@material-ui/core';
import { exportComponentAsPNG } from 'react-component-export-image';
import { useLocation } from 'react-router-dom';

import './Chart.css';
import { 
    getPublicFacilitiesDatasets, 
    getTypologyAverageAndDeviationDatasets, 
    getPublicFacilityField, 
    getPublicFacilitiesNamesFromIds
} from '../../actions/publicFacility';
import { MONTHS, CONSUMPTION, PRICE, SUPERSCRIPT_TWO, DATA_TYPES, AREA } from '../../constants';
import ChartLegend from './ChartLegend/ChartLegend';
import ExportChart from './ExportChart/ExportChart';

function Chart({ displayedDatasets = [] }) {
//Returns the chart page 

    const [data, setData] = useState(null);
    const [chartTitle, setChartTitle] = useState('');

    const exportChartRef = useRef();
    const { dataType, ids } = useParams(); 
    const idsList = ids.split(',');
    const location = useLocation();

    const options = {
        //Don't display the default legend
        legend: { display: false },
        title: { display: true, text: chartTitle, fontSize: 22 },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,  
                    //add suffix                 
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
        //Return datsets of average and deviation from facilities of the same typology that the firts facility in the chart
        const typology = await getPublicFacilityField(idsList[0], 'typology');
        return await getTypologyAverageAndDeviationDatasets(typology, dataType);
    }

    const setDisplayedDatasets = (datasets) => {
        //Display datasets from previous state
        for(const displayedDataset of displayedDatasets){
            const index = datasets.findIndex(dataset => dataset.label == displayedDataset);
            if(index >= 0){
                datasets[index].hidden = false;
            }
        }
        return datasets;
    }

    useEffect(async () => {  
        //Set all chart datasets when the page is loaded
        let facilitiesDatasets = await getPublicFacilitiesDatasets(idsList, dataType);  

        if(facilitiesDatasets.length > 0){
            const typologyDatasets = await getTypologyDatasets();
            facilitiesDatasets = facilitiesDatasets.concat(typologyDatasets);
        }
        const datasets = setDisplayedDatasets(facilitiesDatasets);
        setData({
            labels: MONTHS,
            datasets
        });           
    }, []);

    useEffect(() => {
        //Update chart title when the page is loaded and when facility is removed
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
        //Get the exportChart component and set it visible in canvas options to export it
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
