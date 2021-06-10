import { useState } from 'react';
import { Paper, Typography, Checkbox, Accordion, AccordionSummary, AccordionDetails, Button, SwipeableDrawer, TableRow } from '@material-ui/core';
import { ExpandMore, ArrowForward, Menu } from '@material-ui/icons';

import './FilterControl.css';
import { TYPOLOGIES, YEARS_LIST } from '../../../constants';

function FilterControl({ filters, setFilters, satelliteView, setSatelliteView, icons }) {
//Return map legend

    //To open legend menu. Only used in small screens
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const MapFilters = () => (
        <div className={openSideMenu ? '' : 'map-filter-paper'} elevation={3}>
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
                            <img src={icons[typology.name]} className='filter-control-icon'/>
                            <Typography variant='body1'>
                                {typology.screenName}
                            </Typography>
                            <Checkbox       
                                className='filter-control-item'        
                                color='primary'
                                checked={filters.typologies.includes(typology.name)}
                                onClick={() => handleFilterClick('typologies', typology.name)}
                            />
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
                            <Typography className='filter-control-item' variant='body1'>
                                {year}
                            </Typography>
                            <Checkbox         
                                className='filter-control-item'      
                                color='primary'
                                checked={filters.years.includes(year)}
                                onClick={() => handleFilterClick('years', year)}
                            />
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
                        <Typography variant='body1'>
                            Satèl·lit
                        </Typography>
                        <Checkbox               
                            color='primary'
                            checked={satelliteView}
                            onClick={() => setSatelliteView(prevState => !prevState)}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );

    const handleFilterClick = (field, value) => {
    //Update filters

        //Remove filter
        if(filters[field].includes(value)){
            setFilters((prevFilters) => ({ 
                ...prevFilters,
                [field]: prevFilters[field].filter(elem => elem != value)
            }));
        } 

        //Add filter
        else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [field]: [...prevFilters[field], value]
            }));
        }
    }
    
    return (
        <div className='map-filter-control'>
            {/* If screen if big enough for the legend show this*/}
           <MapFilters className='map-filter-paper' />
           {/* If screen if small show this */}
            <div className='map-filter-hamburger-menu'>
                { !openSideMenu && 
                    <Paper>
                        <Button onClick={() => setOpenSideMenu(true)}>
                            <Menu/>
                        </Button>
                    </Paper>
                }
                { openSideMenu && 
                    <Paper className='map-filter-side-menu'>
                        <Button  className='map-filter-side-menu-btn' onClick={() => setOpenSideMenu(false)}>
                            <ArrowForward/>
                            &nbsp;Tancar
                        </Button>
                        <MapFilters/>
                    </Paper>
                }          
            </div>
        </div>
    )
}

export default FilterControl
