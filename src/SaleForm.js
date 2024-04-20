import React, { useContext } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { SalesContext } from './SalesContext';

function SaleForm() {
    const { formData, setFormData, addOrUpdateSale } = useContext(SalesContext);
    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
            <TextField
                label="Item Name"
                variant="outlined"
                name="itemName"
                value={formData.itemName}
                onChange={handleFormChange}
            />
            <TextField
                label="Price"
                variant="outlined"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
            />
            <TextField
                label="Date"
                type="date"
                variant="outlined"
                name="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleFormChange}
            />
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleFormChange}
                >
                    <MenuItem value="Clothes">Clothes</MenuItem>
                    <MenuItem value="Jewelry">Jewelry</MenuItem>
                    <MenuItem value="Bag">Bag</MenuItem>
                    <MenuItem value="Stationary">Stationary</MenuItem>
                    {/* Add more categories as needed */}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                    name="paymentMode"
                    value={formData.paymentMode}
                    label="Payment Mode"
                    onChange={handleFormChange}
                >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={addOrUpdateSale}>
                {formData.editing ? 'Update Sale' : 'Add Sale'}
            </Button>
        </Box>
    );
}

export default SaleForm;


