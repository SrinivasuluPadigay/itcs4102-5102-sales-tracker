import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
    const [sales, setSales] = useState([]);
    const [formData, setFormData] = useState({
        itemName: '',
        price: '',
        date: '',
        paymentMode: 'cash',
        category: '',
        editing: false,
        id: null
    });
    const [todayTotals, setTodayTotals] = useState({ cash: 0, card: 0 });

    useEffect(() => {
        fetchSales();
        fetchTodayTotals();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:8080/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Failed to fetch sales', error);
        }
    };

    const addOrUpdateSale = async () => {
        const submissionData = {
            ...formData,
            price: parseFloat(formData.price) || 0
        };
        const method = formData.editing ? 'put' : 'post';
        const url = formData.editing ? `http://localhost:8080/sales/${formData.id}` : 'http://localhost:8080/sales';
        try {
            await axios[method](url, submissionData);
            await fetchSales();
            await fetchTodayTotals();
            setFormData({
                itemName: '',
                price: '',
                date: '',
                paymentMode: 'cash',
                category: '',
                editing: false,
                id: null
            });
        } catch (error) {
            console.error('Failed to add/update sale', error);
        }
    };

    const deleteSale = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/sales/${id}`);
            await fetchSales();
            await fetchTodayTotals();
        } catch (error) {
            console.error('Failed to delete sale', error);
        }
    };

    const startEdit = (sale) => {
        setFormData({
            ...sale,
            editing: true
        });
    };

    const fetchTodayTotals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/today-sales');
            setTodayTotals(response.data);
        } catch (error) {
            console.error('Failed to fetch today\'s totals', error);
        }
    };

    return (
        <SalesContext.Provider value={{
            sales, 
            formData, 
            setFormData, 
            addOrUpdateSale, 
            deleteSale, 
            startEdit, // Include startEdit here
            todayTotals
        }}>
            {children}
        </SalesContext.Provider>
    );
};
