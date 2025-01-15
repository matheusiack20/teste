import React from 'react';
import App from 'next/app';
import { format } from 'date-fns';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const formattedDate = format(new Date(), 'yyyy-MM-dd');

    return (
      <div>
        {/* ...existing code... */}
        <p>Formatted Date: {formattedDate}</p>
        <Component {...pageProps} />
        {/* ...existing code... */}
      </div>
    );
  }
}

export default MyApp;
