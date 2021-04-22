import { 
    Accordion, 
    AccordionSummary, 
    IconButton, 
    Typography, 
    AccordionDetails, 
    Grid, 
    Checkbox 
    } from '@material-ui/core';
import { ExpandMore, RemoveCircleOutline } from '@material-ui/icons'; 

import './CustomAccordion.css';

function CustomAccordion({ facilityName, facilities, canRemove, handleRemoveFacility, handleLegendClick}) {

    const getCircleStyles = (color = '#CACFD2') => ({
        height: '25px', 
        width: '25px', 
        backgroundColor: color, 
        borderRadius:'50%', 
        marginLeft: '17px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        zIndex: '5'
    });

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Typography variant='body1'>
                    {facilityName}
                </Typography>
                {  canRemove && 
                    <IconButton 
                        className='chart-legend-remove-btn' 
                        onClick={(event) => handleRemoveFacility(event, facilityName)}
                    >
                        <RemoveCircleOutline />
                    </IconButton>
                }
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    { Object.keys(facilities).map((concept, conceptIndex) => (
                        <Grid item xs={12} sm={6} md={3} key={conceptIndex}>
                            <Typography variant='h5'>
                                {concept}
                            </Typography>
                            { facilities[concept].map((dataset, datasetIndex) => (
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
                                    <div style={getCircleStyles(dataset.borderColor)}/>
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
