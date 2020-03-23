import React, {useState} from 'react';
import { Heading, Button, Box, Text } from 'grommet';

const PlayerGuess = () =>{

  const [value, setValue] = useState('GUESS1');

  const handleChange = () => {
    const newValue = (value === 'GUESS1' ? 'GUESS2':'GUESS1');
    setValue(newValue);
  }

  return (
    <Box margin={{ bottom: 'medium' }} justify="center" align="center">
      <Text>Your prompt is: </Text>
      <Heading>{value}</Heading>
      <Button onClick={handleChange} label="Submit Guess" />
    </Box>);
}

export default PlayerGuess;