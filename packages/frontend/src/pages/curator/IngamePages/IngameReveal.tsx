import 'styled-components/macro';

import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { RenderChain } from 'src/components/RenderChain';

interface IInGameReveal {
  chain: IChain | null;
}

const IngameReveal: FunctionComponent<IInGameReveal> = ({ chain }) => {
  return <Box fill>{chain ? <RenderChain chain={chain} /> : <></>}</Box>;
};

export { IngameReveal };
