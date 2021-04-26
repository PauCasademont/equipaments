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

function CustomAccordion({ facilityName, facilities, canRemove, handleRemoveFacility, handleLegendClick, handleChangeColor}) {

    const getCircleStyles = (color = '#CACFD2') => ({
        background: color, 
        height: '25px', 
        width:'25px', 
        marginLeft: '17px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '1px solid black'
    })

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
                                    <label style={getCircleStyles(dataset.borderColor)}>
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
