import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { SalesProvider } from './SalesContext';
import reportWebVitals from './reportWebVitals';

// Optional: Define a custom theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',  // Example primary color
    },
    secondary: {
      main: '#19857b',  // Example secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',  // Example font family
    fontSize: 14,  // Base font size
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />  
      <SalesProvider>  
        <App />
      </SalesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
