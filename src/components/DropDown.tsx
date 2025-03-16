import { Select } from '@chakra-ui/react';
import { useState } from 'react';

const DropDown = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedValue(value);
        onValueChange(value);
    };

    return (
        <Select 
            width="157px" 
            height="40px" 
            textAlign="left"
            onChange={handleChange}
            value={selectedValue}
        >
            <option value="333">3x3x3</option>
            <option value="222">2x2x2</option>
        </Select>
    );
}

export default DropDown;