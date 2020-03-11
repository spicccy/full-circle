import React, { FunctionComponent } from 'react';
import { Canvas } from './components/Canvas/Canvas';

export const App: FunctionComponent = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Canvas />
      </header>
    </div>
  );
};
