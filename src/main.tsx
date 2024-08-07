import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@app/App';

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
