import { BACKEND_PORT } from '@full-circle/shared/lib/constants';
import * as Colyseus from 'colyseus.js';
import { createContext, useContext } from 'react';

const colyseusUrl =
  process.env.REACT_APP_BACKEND_LOCALHOST === 'true'
    ? `ws://localhost:${BACKEND_PORT}`
    : process.env.REACT_APP_BACKEND_URL;

const client = new Colyseus.Client(colyseusUrl);
export const ColyseusContext = createContext(client);
export const useColyseus = () => useContext(ColyseusContext);
