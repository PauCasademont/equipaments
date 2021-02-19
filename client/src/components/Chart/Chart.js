import { useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';

import './Chart.css';
import { getPublicFacilityDatasets } from '../../actions/publicFacility';
import { labels } from '../../constants/chart';

function Chart({ selectedFacility }) {
    const [data, setData] = useState(null);

    useEffect(() => {        
        getPublicFacilityDatasets(selectedFacility.id)
            .then((datasets) => {
                setData({labels, datasets});
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className='chart'>
            { data && <Line data={data} /> }
        </div>
    )
}

export default Chart
