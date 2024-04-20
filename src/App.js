import React from 'react';
import SaleForm from './SaleForm';
import SaleList from './SaleList';
import { Container } from '@mui/material';

function App() {
    return (
        <Container maxWidth="md">
            <h1>Sales Tracker</h1>
            <SaleForm />
            <SaleList />
        </Container>
    );
}

export default App;

