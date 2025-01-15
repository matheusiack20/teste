import { useState, useEffect } from 'react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <div>
      <h1>Bem-vindo!</h1>
      <p>Hora atual: {currentTime}</p>
    </div>
  );
}
