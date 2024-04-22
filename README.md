# Sales Tracker Application

## Overview
This Sales Tracker is a full-stack web application that allows users to add, update, and delete sales records. The backend is built with Go and utilizes an SQLite database for persistent storage, while the frontend is developed with React.js, offering a dynamic and responsive user interface.

## Features
- **Add Sales**: Users can enter details of a sale, including item name, price, category, date, and payment mode.
- **Edit Sales**: Existing sales records can be modified.
- **Delete Sales**: Users can remove sales records from the system.
- **View Sales**: Sales records are listed with details and can be filtered by date.
- **Export to PDF**: Users can export the list of sales to a PDF document.
- **Real-time Totals**: The application calculates and displays the total sales for the current day, separated by cash and card payments.

## Frontend

### Technologies
- **React.js**: For building the user interface.
- **Material-UI**: For styling and layout components.
- **Axios**: For making HTTP requests to the backend.

### Components
- `SaleForm.js`: Handles the input form for adding or updating sales.
- `SaleList.js`: Displays the list of sales and includes functionality for editing, deleting, and exporting sales data.
- `SalesContext.js`: Manages the global state for sales data and provides context to other components.
- `Totals.js`: Shows the total cash and card sales for the current day.
- `main.go` (backend file): Provides the server-side logic and API endpoints.

## Backend

### Technologies
- **Go (Golang)**: For creating the backend server and handling API requests.
- **Gin**: Web framework used to simplify routing and request handling.
- **SQLite**: Database used for storing sales records.
- **Gofpdf**: Library used for generating PDF documents from sales data.

### Endpoints
- GET `/sales`: Retrieves all sales records.
- POST `/sales`: Adds a new sale record.
- PUT `/sales/:id`: Updates an existing sale record.
- DELETE `/sales/:id`: Deletes a sale record.
- GET `/today-sales`: Fetches total sales for the current day.
- GET `/export-sales`: Exports sales data to a PDF file.

## Installation

### Prerequisites
- Node.js and npm
- Go programming environment

### Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory and install dependencies for the frontend:
   ```sh
   npm install
3. Run the frontend development server
    ```sh    
    npm start
4. In a separate terminal, navigate to the backend directory and run the Go server:
    ```sh
    go run main.go

### Usage
Once both servers are running, open a web browser and go to http://localhost:3000 to access the Sales Tracker application.

###  Development Notes
- Before deploying the application, ensure environment variables and database configurations are set up correctly.
- Consider implementing additional features such as user authentication and advanced sales analytics.
