import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

import './Chart.css';
import { getPublicFacilityDatasets } from '../../actions/publicFacility';
import { labels } from '../../constants/chart';
import ChartLegend from './ChartLegend/ChartLegend';

function Chart() {
    const [data, setData] = useState({});
    const [title, setTitle] = useState('');   
    const chartRef = useRef();
    const { id } = useParams(); 
    

    useEffect(() => {   
        getPublicFacilityDatasets(id)
            .then((datasets) => {
                setData({labels, datasets});
                })
            .catch((error) => console.log(error));
        setTitle('New title');
    }, []);

    return (
        <div className='chart'>
            <ChartLegend chartRef={chartRef} datasets={data.datasets}/>
            <Line 
                ref={chartRef}
                data={data} 
                options={{
                    legend: { display: false, position: 'bottom' },
                    title: { display: true, text: title, fontSize: 30},
                    responsive: true
                }} 
            /> 
        </div>
    )
}

export default Chart
