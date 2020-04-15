import { Box } from 'grommet';
import React, { ChangeEventHandler, FunctionComponent, useState } from 'react';
import styled from 'styled-components/macro';

const RoomInputWrapper = styled(Box)`
  position: relative;
  height: 50px;
  width: 120px;
  user-select: none;
`;

const Label = styled.label`
  font-size: 26px;
  margin-right: 30px;
`;

const PinWrapper = styled(Box)<{ focused: boolean }>`
  position: absolute;
  font-size: 26px;
  width: 100%;
`;

const PinNumber = styled.span<{ focused: boolean }>`
  ${(props) => props.focused && 'color: orange;'}
`;

const TransparentInput = styled.input`
  position: absolute;
  height: 100%;
  width: 100%;
  color: transparent;
  background: none;
  border: none;
  outline: none;
`;

interface IRoomInputProps {
  value: string;
  onChange(value: string): void;
}

export const RoomInput: FunctionComponent<IRoomInputProps> = ({
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const stripped = e.target.value.replace(/[^0-9]/gi, '').substring(0, 4);
    onChange(stripped);
  };

  const pins = [...Array(4)].map((_, index) => {
    const pinFocused = focused && (value.length >= 4 || value.length === index);
    return (
      <PinNumber key={index} focused={pinFocused}>
        {value[index] ?? '_'}
      </PinNumber>
    );
  });

  return (
    <Box direction="row" align="center" margin={{ bottom: 'small' }}>
      <Label htmlFor="roomCode">Room:</Label>
      <RoomInputWrapper justify="center">
        <PinWrapper focused={focused} direction="row" justify="between">
          {pins}
        </PinWrapper>
        <TransparentInput
          id="roomCode"
          data-testid="roomCodeInput"
          type="tel"
          pattern="[0-9]*"
          required
          maxLength={4}
          autoComplete="off"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </RoomInputWrapper>
    </Box>
  );
};
