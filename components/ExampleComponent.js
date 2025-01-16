import React, { useEffect, useState } from 'react';

const ExampleComponent = () => {
  const [randomNumber, setRandomNumber] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    setRandomNumber(Math.random());
    setCurrentDate(new Date().toISOString());
  }, []);

  return (
    <div>
      {/* Renderização condicional baseada no ambiente */}
      {typeof window !== 'undefined' && (
        <>
          <p>Random Number: {randomNumber}</p>
          <p>Current Date: {currentDate}</p>
        </>
      )}
    </div>
  );
};

export default ExampleComponent;
