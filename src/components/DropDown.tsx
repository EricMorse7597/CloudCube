import { Select } from '@chakra-ui/react';
import { useState } from 'react';

const DropDown = () => {
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        console.log("Selected value:", event.target.value);
    };

    return (
        <Select 
            width="157px" 
            height="40px" 
            textAlign="center"
            onChange={handleChange}
            value={selectedValue}
        >
            <option value="333">3x3x3</option>
            <option value="222">2x2x2</option>
        </Select>
    );
}

export default DropDown;