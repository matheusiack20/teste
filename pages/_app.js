import React, { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Código que depende do objeto `window`
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
