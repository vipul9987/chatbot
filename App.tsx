
import React from 'react';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* 
        This is a minimal container. 
        In a real website embed, this component would be rendered 
        into a small div or directly into the body.
      */}
      <ChatWidget />
    </div>
  );
};

export default App;
