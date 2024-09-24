package middleware

import (
	"io"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// gin.DisableConsoleColor()
		f, _ := os.OpenFile("expensetracker.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		gin.DefaultWriter = io.MultiWriter(f)
		start := time.Now()
		c.Next()
		duration := time.Since(start)
		log.SetOutput(f)
		log.Printf("Request - Method: %s | Status: %d | Duration: %v", c.Request.Method, c.Writer.Status(), duration)
	}
}
