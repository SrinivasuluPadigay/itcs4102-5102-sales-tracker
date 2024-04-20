import React, { useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Divider, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { SalesContext } from './SalesContext';
import './SaleList.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function SaleList() {
    const { sales, startEdit, deleteSale } = useContext(SalesContext);
    
    if (!sales || sales.length === 0) return <Typography>No sales data available.</Typography>;

    const salesWithTotals = sales.reduce((acc, sale) => {
        const date = sale.date;
        if (!acc[date]) {
            acc[date] = {
                sales: [],
                totals: { cash: 0, card: 0 }
            };
        }
        acc[date].sales.push(sale);
        if (sale.paymentMode === 'cash') {
            acc[date].totals.cash += parseFloat(sale.price);
        } else if (sale.paymentMode === 'card') {
            acc[date].totals.card += parseFloat(sale.price);
        }
        return acc;
    }, {});
	
	const exportSalesToPDF = async (date, sales, totals) => {
		// Temporarily add a class to hide elements you don't want to export
		const exportButton = document.querySelector(`#export-btn-${date}`);
		exportButton.classList.add('print-hide');
	
		const input = document.getElementById(`sales-${date}`); // The ID of the div you want to export
		const canvas = await html2canvas(input);
		const data = canvas.toDataURL('image/png');
	
		// Remove the class so the button shows again after capturing for PDF
		exportButton.classList.remove('print-hide');
	
		const pdf = new jsPDF();
		const imgProps = pdf.getImageProperties(data);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
		pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
		pdf.save(`sales-${date}.pdf`);
	};
    const sortedDates = Object.keys(salesWithTotals).sort((a, b) => new Date(b) - new Date(a));

    return (
        <List sx={{ width: '100%', mt: 4 }}>
            {Object.keys(salesWithTotals).sort((a, b) => new Date(b) - new Date(a)).map(date => {
                const { sales, totals } = salesWithTotals[date];
                return (
                    <React.Fragment key={date}>
                        <Paper elevation={2} sx={{ my: 2, p: 2 }} id={`sales-${date}`}>
                            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                Sales on {date} | Cash Sales: ${totals.cash.toFixed(2)} | Card Sales: ${totals.card.toFixed(2)} 
								<Button
									id={`export-btn-${date}`}
									variant="contained"
									onClick={() => exportSalesToPDF(date, sales, totals)}
								>
									Export to PDF
								</Button>

							</Typography>
                            
                            <Divider sx={{ mb: 2 }} />
                            {sales.map((sale, index) => (
                                <ListItem 
                                    key={index} 
                                    secondaryAction={
                                        <>
                                            <IconButton className="print-hide" onClick={() => startEdit(sale)}><EditIcon /></IconButton>
                                            <IconButton className="print-hide" onClick={() => deleteSale(sale.id)}><DeleteIcon /></IconButton>
                                        </>
                                    }
                                    sx={{ mb: 1 }}
                                >
                                    <ListItemText
                                        primary={`${sale.itemName} - $${sale.price.toFixed(2)}`}
                                        secondary={`Category: ${sale.category} | Date: ${sale.date} | Payment Mode: ${sale.paymentMode}`}
                                    />
                                </ListItem>
                            ))}
                        </Paper>
                    </React.Fragment>
                );
            })}
        </List>
    );
}

export default SaleList;
