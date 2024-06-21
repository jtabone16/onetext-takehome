import React from 'react';
import FlowBuilder from './FlowBuilder';
import { FlowProvider } from './FlowContext';

const App: React.FC = () => {
  return (
    <FlowProvider>
      <div className="app">
        <h1 className="text-2xl font-bold text-center my-4">
          Messaging Flow Builder
        </h1>
        <FlowBuilder />
      </div>
    </FlowProvider>
  );
};

export default App;
