import React, {useState} from 'react';

const PlayerGuess = () =>{

  const [value, setValue] = useState('GUESS1');

  const handleChange = () => {
    const newValue = (value === 'GUESS1' ? 'GUESS2':'GUESS1');
    setValue(newValue);
  }

  return (
    <div>
      <span>{value}</span>
      <button onClick={handleChange}> Submit Guess </button>
    </div>);
}

export default PlayerGuess;