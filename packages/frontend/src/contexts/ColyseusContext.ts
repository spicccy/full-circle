import { BACKEND_PORT } from '@full-circle/shared/lib/constants';
import * as Colyseus from 'colyseus.js';
import { createContext, useContext } from 'react';

const client =
  process.env.BACKEND_LOCALHOST === 'true'
    ? new Colyseus.Client(`ws://localhost:${BACKEND_PORT}`)
    : new Colyseus.Client(`${process.env.REACT_APP_BACKEND_URL}`);
export const ColyseusContext = createContext(client);
export const useColyseus = () => useContext(ColyseusContext);
