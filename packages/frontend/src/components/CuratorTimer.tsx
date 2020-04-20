import { Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

export const CuratorTimer: FunctionComponent = () => {
  const phaseTimer = usePhaseTimer();
  const { allSubmitted } = useRoomHelpers();

  if (phaseTimer === undefined) {
    return null;
  }
  if (phaseTimer < -1) {
    return null;
  }
  if (allSubmitted) {
    return null;
  }
  return <Text data-testid="curatorTimer"> Timer: {phaseTimer}</Text>;
};
