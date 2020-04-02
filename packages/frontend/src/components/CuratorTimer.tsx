import { Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';

export const CuratorTimer: FunctionComponent = () => {
  const phaseTimer = usePhaseTimer();
  if (phaseTimer === undefined) {
    return null;
  }

  return <Text> Timer: {phaseTimer}</Text>;
};
