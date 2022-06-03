import React from 'react';
import ReactDOM from 'react-dom/client';
import "primereact/resources/themes/tailwind-light/theme.css";  
import "primereact/resources/primereact.min.css";             
import "primeicons/primeicons.css";    
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const qc = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
          <App />
    </QueryClientProvider>

  </React.StrictMode>
);

