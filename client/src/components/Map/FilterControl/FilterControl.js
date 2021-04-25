import { Paper, Typography, Checkbox, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import './FilterControl.css';
import { TYPOLOGIES, YEARS_LIST } from '../../../constants';

function FilterControl({ filters, setFilters, satelliteView, setSatelliteView }) {

    const handleFilterClick = (field, value) => {
        if(filters[field].includes(value)){
            setFilters((prevFilters) => ({ 
                ...prevFilters,
                [field]: prevFilters[field].filter(elem => elem != value)
            }));
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [field]: [...prevFilters[field], value]
            }));
        }
    }
    
    return (
        <div className='map-filter-control'>
            <div className='map-filter-paper' elevation={3}>
                <Accordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <div className='map-filter-title-div'>
                            <Typography variant='h6'>
                                Tipologies
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className='map-filter-accordion-details'>
                        { TYPOLOGIES.map((typology, index) => (
                            <div key={index} className='map-filter-item'>
                                <Checkbox               
                                    color='primary'
                                    checked={filters.typologies.includes(typology.icon)}
                                    onClick={() => handleFilterClick('typologies', typology.icon)}
                                />
                                <Typography variant='body1'>
                                    {typology.name}
                                </Typography>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <div className='map-filter-title-div'>
                            <Typography variant='h6'>
                                Anys
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className='map-filter-accordion-details'>
                        { YEARS_LIST.map((year, index) => (
                            <div key={index} className='map-filter-item'>
                                <Checkbox               
                                    color='primary'
                                    checked={filters.years.includes(year)}
                                    onClick={() => handleFilterClick('years', year)}
                                />
                                <Typography variant='body1'>
                                    {year}
                                </Typography>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <div className='map-filter-title-div'>
                            <Typography variant='h6'>
                                Mapa Base
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className='map-filter-accordion-details'>
                        <div className='map-filter-item'>
                            <Checkbox               
                                color='primary'
                                checked={satelliteView}
                                onClick={() => setSatelliteView(prevState => !prevState)}
                            />
                            <Typography variant='body1'>
                                Satèl·lit
                            </Typography>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    )
}

export default FilterControl
