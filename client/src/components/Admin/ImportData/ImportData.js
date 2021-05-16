import { useState } from 'react'
import { Button, Paper, TextField, Typography, CircularProgress } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

import './ImportData.css';
import { importDataFromCSV } from '../../../actions/publicFacility';

const IMPORT_STATES = {
    setUp: 'setUp',
    importing: 'importing',
    done: 'done'
};

const getYearFromFileName = (name) => {
    return parseInt(name.substring(name.length - 8, name.length - 4));
}

function ImportData({ fileData, setOpenPopup }) {

    const [year, setYear] = useState(getYearFromFileName(fileData.fileName) || '');
    const [importState, setImportState] = useState(IMPORT_STATES.setUp);
    const [notImportedData, setNotImportedData] = useState([]);

    const notImportedDataColumns = [
        { field: 'name', headerName: 'Equipament', width: 300 },
        { field: 'concept', headerName: 'Concepte', width: 120 },
        { field: 'dataType', headerName: 'Tipus de dades', width: 150 }
    ];

    const handleImport = () => {
        setImportState(IMPORT_STATES.importing);
        importDataFromCSV(fileData.strFile, year)
        .then(notImportedResult => {
            setNotImportedData(notImportedResult);
            setImportState(IMPORT_STATES.done);
        })
    }

    const handleClose = () => {
        setOpenPopup(prevState => ({ 
            ...prevState, 
            importData: 
                { 
                    ...prevState.importData, 
                    open: false 
                } 
        }));
    }

    return (
        <div className='import-data-popup'>
            <Paper elevation={10} className='import-data-popup-inner'>
                <div className='import-data-title'>
                    <Typography  variant='h4' color='primary' gutterBottom>
                        Importar Dades 
                    </Typography>
                    { importState == IMPORT_STATES.setUp &&
                        <Typography variant='h6'>
                            Fitxer: {fileData.fileName}
                        </Typography>
                    }
                    { importState == IMPORT_STATES.importing &&
                        <Typography variant='h6'>
                            Important dades
                        </Typography>
                    }
                    { importState == IMPORT_STATES.done &&
                        <Typography variant='h6'>
                            Importació finalitzada correctament
                        </Typography>
                    }
                </div>
                { importState == IMPORT_STATES.setUp &&
                    <>
                        <div className='import-data-input-div'>
                            <Typography variant='body1' className='import-data-input-label'>
                                Any de les dades:
                            </Typography>
                            <TextField
                                name='year'
                                className='import-data-input'
                                label='Any'
                                type='number'
                                required
                                step='1'
                                value={year}
                                onChange={event => setYear(event.target.value)}
                            />
                        </div>
                        <div className='import-data-btns-div'>
                            <Button 
                                variant='outlined' 
                                color='primary' 
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button> 
                            <Button className='import-data-btn' variant='contained' onClick={handleImport}>
                                Importar
                            </Button>
                        </div>
                    </>
                }
                { importState == IMPORT_STATES.importing &&
                    <div className='import-data-loading-div'>
                        <CircularProgress/>
                    </div>
                }
                { importState == IMPORT_STATES.done &&
                    <>
                        <div className='import-data-table'>
                            <Typography variant='body1'>
                                Dades que no s'han sobreescrit:
                            </Typography>
                            <DataGrid rows={notImportedData} columns={notImportedDataColumns} pageSize={10}/>
                        </div>
                        <div className='import-data-btns-div'>
                            <Button 
                                variant='outlined' 
                                color='primary' 
                                onClick={handleClose}
                            >
                                TORNAR
                            </Button>                             
                        </div>
                    </>
                }
            </Paper>
        </div>
    )
}

export default ImportData
