import { Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';

export const CuratorTimer: FunctionComponent = () => {
  const phaseTimer = usePhaseTimer();

  if (phaseTimer === undefined) {
    return null;
  }
  if (phaseTimer < 0) {
    return null;
  }
  return <Text data-testid="curatorTimer"> Timer: {phaseTimer}</Text>;
};
