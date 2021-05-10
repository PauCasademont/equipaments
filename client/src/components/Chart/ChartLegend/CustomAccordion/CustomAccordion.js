import { 
    Accordion, 
    AccordionSummary, 
    IconButton, 
    Typography, 
    AccordionDetails, 
    Grid, 
    Checkbox
    } from '@material-ui/core';
import { ExpandMore, DeleteOutline } from '@material-ui/icons'; 

import './CustomAccordion.css';

function CustomAccordion({ facilityName, facility, canRemove, handleRemoveFacility, handleLegendClick, handleChangeColor}) {


    const getCircleStyles = (color = '#CACFD2', isFacility) => ({
        background: isFacility ? color : `repeating-linear-gradient(90deg, ${color}, white 5px, ${color} 5px)`, 
        height: '25px', 
        width:'25px', 
        marginLeft: '17px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '1px solid black'
    })

    const isMinDeviation = (dataset) => {
        return 'isDeviation' in dataset && dataset.isDeviation == 'min';
    }

    const getSortedDatasets = (facility, concept) => {
        var result = facility[concept];
        result.sort((a,b) => b.year - a.year);
        // console.log('facility: ', facilityName, 'concept: ', concept, 'result: ',result);
        return result;
    }

    return (
        <Accordion className='chart-legend-accordion'>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Typography variant='body1'>
                    {facilityName}
                </Typography>
                {  canRemove && 
                    <IconButton 
                        className='chart-legend-remove-btn' 
                        onClick={(event) => handleRemoveFacility(event, facilityName)}
                    >
                        <DeleteOutline />
                    </IconButton>
                }
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    { Object.keys(facility).map((concept, conceptIndex) => (                        
                        <Grid item xs={12} sm={6} md={3} key={conceptIndex}>
                            <Typography variant='h5'>
                                {concept}
                            </Typography>
                            { getSortedDatasets(facility, concept).map((dataset, datasetIndex) => (
                                !isMinDeviation(dataset) && 
                                <div className='chart-legend-item' key={datasetIndex}>
                                    <Checkbox
                                        className='chart-legend-checkbox'
                                        checked={!dataset.hidden}
                                        color='primary'
                                        onClick={() => handleLegendClick(dataset)}
                                    />
                                    <Typography variant='h6'>
                                        {dataset.year}
                                    </Typography>
                                    <label style={getCircleStyles(dataset.borderColor, dataset.borderDash == null)}>
                                        <input 
                                            className='chart-legend-input-color' 
                                            type='color' 
                                            onChange={(e) => handleChangeColor(dataset.label, e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

export default CustomAccordion
