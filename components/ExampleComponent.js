import React, { useEffect, useState } from 'react';

const ExampleComponent = () => {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  return (
    <div>
      {/* ...existing code... */}
      {currentTime && <p>Current Time: {currentTime}</p>}
      {/* ...existing code... */}
    </div>
  );
};

export default ExampleComponent;
