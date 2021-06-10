import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import './DropDownBox.css';

function DropDownBox({ values, selectedValue, setValue, name }) {
//Return a multi select option 
    return (
        <FormControl className='edit-form'>
            <InputLabel id='edit-select-label'>
                {name}
            </InputLabel>
            <Select
                className='edit-select'
                labelId='edit-select-label'
                value={selectedValue}
                onChange={(event) => { setValue(event.target.value) }}
            >
                { values.map((value, index) => (
                    <MenuItem key={index} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default DropDownBox
