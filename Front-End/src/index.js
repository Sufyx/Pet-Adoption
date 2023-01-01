import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

// if (process.env.NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter >
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </BrowserRouter>
);

