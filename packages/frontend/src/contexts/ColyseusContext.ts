import * as Colyseus from 'colyseus.js';
import { createContext, useContext } from 'react';

const client = new Colyseus.Client(`ws://localhost:2567`);
export const ColyseusContext = createContext(client);
export const useColyseus = () => useContext(ColyseusContext);
