package main

import (
    "database/sql"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    _ "github.com/mattn/go-sqlite3" // Use underscore if it's only for the side effect of registering the driver
	"log"
    "net/http"
    "strconv"
	"time"
)

type Sale struct {
    ID          int     `json:"id"`
    ItemName    string  `json:"itemName"`
    Price       float64 `json:"price"`
    Date        string  `json:"date"`
    PaymentMode string  `json:"paymentMode"`
    Category    string  `json:"category"` // New field for category
}

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("sqlite3", "./sales.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    createTable()

    r := gin.Default()
    r.Use(cors.Default())
    r.GET("/sales", getSales)
    r.POST("/sales", postSale)
    r.PUT("/sales/:id", updateSale)
    r.DELETE("/sales/:id", deleteSale)
    r.GET("/today-sales", getTodaySales) // This should be inside the main function
    r.Run(":8080")
}


func createTable() {
    createTableSQL := `
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itemName TEXT NOT NULL,
        price REAL NOT NULL,
        date TEXT NOT NULL,
        paymentMode TEXT NOT NULL,
		category TEXT NOT NULL
    );`
    _, err := db.Exec(createTableSQL)
    if err != nil {
        log.Fatal(err)
    }
    
}

func getSales(c *gin.Context) {
    rows, err := db.Query("SELECT id, itemName, price, date, paymentMode, category FROM sales")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var sales []Sale
    for rows.Next() {
        var sale Sale
        if err := rows.Scan(&sale.ID, &sale.ItemName, &sale.Price, &sale.Date, &sale.PaymentMode, &sale.Category); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        sales = append(sales, sale)
    }
    c.JSON(http.StatusOK, sales)
}


func postSale(c *gin.Context) {
    var newSale Sale
    if err := c.BindJSON(&newSale); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    stmt, err := db.Prepare("INSERT INTO sales(itemName, price, date, paymentMode, category) VALUES(?, ?, ?, ?, ?)")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer stmt.Close()
    _, err = stmt.Exec(newSale.ItemName, newSale.Price, newSale.Date, newSale.PaymentMode, newSale.Category)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, newSale)
}

func updateSale(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }
    var updatedSale Sale
    if err := c.BindJSON(&updatedSale); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    stmt, err := db.Prepare("UPDATE sales SET itemName=?, price=?, date=?, paymentMode=?, category=? WHERE id=?")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer stmt.Close()
    _, err = stmt.Exec(updatedSale.ItemName, updatedSale.Price, updatedSale.Date, updatedSale.PaymentMode, updatedSale.Category, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, updatedSale)
}

func deleteSale(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }
    stmt, err := db.Prepare("DELETE FROM sales WHERE id=?")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer stmt.Close()
    _, err = stmt.Exec(id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusOK)
}

func getTodaySales(c *gin.Context) {
    today := time.Now().Format("2006-01-02") // Format today's date as YYYY-MM-DD
    query := `
        SELECT paymentMode, SUM(price) as total
        FROM sales
        WHERE date = ?
        GROUP BY paymentMode
    `
    rows, err := db.Query(query, today)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query sales"})
        return
    }
    defer rows.Close()

    totals := make(map[string]float64)
    for rows.Next() {
        var paymentMode string
        var total float64
        err := rows.Scan(&paymentMode, &total)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read sales totals"})
            return
        }
        totals[paymentMode] = total
    }
    c.JSON(http.StatusOK, totals)
}

