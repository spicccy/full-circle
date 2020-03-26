import { BACKEND_PORT } from '@full-circle/shared/lib/constants';
import * as Colyseus from 'colyseus.js';
import { createContext, useContext } from 'react';

const client = new Colyseus.Client(`ws://localhost:${BACKEND_PORT}`);
export const ColyseusContext = createContext(client);
export const useColyseus = () => useContext(ColyseusContext);
