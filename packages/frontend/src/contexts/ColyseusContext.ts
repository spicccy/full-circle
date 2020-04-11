import { BACKEND_PORT } from '@full-circle/shared/lib/constants';
import * as Colyseus from 'colyseus.js';
import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

// allows use of server url in consumer code without invarianting per-component
const GET_BACKEND_SERVER_URL = (): string => {
  const _SERVER_URL =
    process.env.REACT_APP_BACKEND_LOCALHOST === 'true'
      ? `ws://localhost:${BACKEND_PORT}`
      : process.env.REACT_APP_BACKEND_URL;
  invariant(
    _SERVER_URL,
    'Ensure $REACT_APP_BACKEND_LOCALHOST and $REACT_APP_BACKEND_URL are configure correctly'
  );

  return _SERVER_URL;
};

export const ColyseusContext = createContext(
  new Colyseus.Client(GET_BACKEND_SERVER_URL())
);
export const useColyseus = () => useContext(ColyseusContext);
