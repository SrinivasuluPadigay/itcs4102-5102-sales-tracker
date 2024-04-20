import React, { useContext } from 'react';
import { SalesContext } from './SalesContext';
import { Typography } from '@mui/material';

function TodayTotals() {
    const { todayTotals } = useContext(SalesContext); // Use the updated context

    return (
        <div>
            <Typography variant="h6">Today's Totals</Typography>
            <Typography>Cash: ${todayTotals.cash.toFixed(2)}</Typography>
            <Typography>Card: ${todayTotals.card.toFixed(2)}</Typography>
        </div>
    );
}

export default TodayTotals;
