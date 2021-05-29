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
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import './CustomAccordion.css';

function CustomAccordion({ facilityName, facility, canRemove, defaultExpanded, handleRemoveFacility, handleLegendClick, handleChangeColor}) {


    const getCircleStyles = (color = '#CACFD2', isAverage, isFacility) => ({
        background: isFacility ? color : `repeating-linear-gradient(90deg, ${color}, white 5px, ${color} 5px)`, 
        height: '25px', 
        width:'25px', 
        marginLeft: isAverage ? '39px' : '17px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '1px solid black'
    })

    const isMinDeviation = (dataset) => {
        return 'isDeviation' in dataset && dataset.isDeviation == 'min';
    }

    return (
        <Accordion className='chart-legend-accordion' defaultExpanded={defaultExpanded}>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Typography variant='body1'>
                    {facilityName}
                </Typography>
                {  canRemove && 
                    <Tippy content='Elimina el menú'>
                        <IconButton 
                            className='chart-legend-remove-btn' 
                            onClick={(event) => handleRemoveFacility(event, facilityName)}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </Tippy>
                }
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    { Object.keys(facility).map((concept, conceptIndex) => (                        
                        <Grid item xs={12} sm={6} md={3} key={conceptIndex}>
                            <Typography variant='h5'>
                                {concept}
                            </Typography>
                            { facility[concept].map((dataset, datasetIndex) => (
                                !isMinDeviation(dataset) && 
                                <div className='chart-legend-item' key={datasetIndex}>
                                    <Checkbox
                                        className='chart-legend-checkbox'
                                        checked={!dataset.hidden}
                                        color='primary'
                                        onClick={() => handleLegendClick(dataset)}
                                    />
                                    { !dataset.isDeviation && !dataset.isAverage &&
                                        <Typography variant='h6' className='chart-legend-year'>
                                            {dataset.year}
                                        </Typography>
                                    }
                                    {
                                        dataset.isDeviation && 
                                        <Tippy content={`La desviació mostra la dispersió respecte la mitjana de les dades de tipologia ${dataset.typology}, concepte ${dataset.concept} i any ${dataset.year}`}>
                                            <Typography variant='h6' className='chart-legend-year'>
                                                {`Desviació ${dataset.year}`}
                                            </Typography>
                                        </Tippy>
                                    }
                                     {
                                        dataset.isAverage && 
                                        <Tippy content={`Mitjana entre les dades de tipologia ${dataset.typology}, concepte ${dataset.concept} i any ${dataset.year}`}>
                                            <Typography variant='h6' className='chart-legend-year'>
                                                {`Mitjana ${dataset.year}`}
                                            </Typography>
                                        </Tippy>
                                    }
                                    <Tippy content='Prem per canviar el color'>
                                        <label style={getCircleStyles(dataset.borderColor, dataset.isAverage, dataset.borderDash == null)}>
                                            <input 
                                                className='chart-legend-input-color' 
                                                type='color' 
                                                onChange={(e) => handleChangeColor(dataset.label, e.target.value)}
                                            />
                                        </label>
                                    </Tippy>
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
