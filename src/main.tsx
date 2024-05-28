import ReactDOM from 'react-dom/client'

import App from '@app/App'
import React from 'react'

ReactDOM.hydrateRoot(
  document!,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
