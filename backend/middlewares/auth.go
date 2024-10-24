package middleware

import (
	"expensetracker/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := utils.TokenValid(c)
		if err != nil {
			log.Println(err)
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}
		c.Next()
	}
}
