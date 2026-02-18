
import React from 'react';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div className="bg-transparent overflow-hidden">
      <ChatWidget />
    </div>
  );
};

export default App;
