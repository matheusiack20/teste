import React, { useState, useEffect } from 'react';

function HomePage() {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  return (
    <div>
      <h1>Bem-vindo à página inicial</h1>
      {currentTime && <p>Hora atual: {new Date(currentTime).toLocaleTimeString()}</p>}
    </div>
  );
}

export default HomePage;
