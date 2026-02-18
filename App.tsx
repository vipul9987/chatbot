
import React from 'react';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none min-h-0 min-w-0">
      {/* Widget is the only visible content; container takes no layout space for embed */}
      <div className="pointer-events-auto">
        <ChatWidget />
      </div>
    </div>
  );
};

export default App;
