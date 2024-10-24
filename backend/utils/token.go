package utils

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"google.golang.org/api/idtoken"
)

func GenerateToken(user_id uuid.UUID) (string, error) {
	tokenLifespan, err := strconv.Atoi(os.Getenv("TOKEN_HOUR_LIFESPAN"))

	if err != nil {
		log.Println(err)
		return "", err
	}

	claims := jwt.MapClaims{}
	claims["user_id"] = user_id.String()
	claims["authorized"] = true
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(tokenLifespan)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("API_SECRET")))

}

func TokenValid(c *gin.Context) error {
	tokenString := ExtractToken(c)
	_, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func ExtractToken(c *gin.Context) string {
	token := c.Query("token")
	if token != "" {
		return token
	}

	bearerToken := c.Request.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}
	return ""
}

func ExtractTokenID(c *gin.Context) (uuid.UUID, error) {
	tokenString := ExtractToken(c)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return uuid.Nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})

	if err != nil {
		log.Println(err)
		return uuid.Nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		userIDString, ok := claims["user_id"].(string)
		if !ok {
			return uuid.Nil, fmt.Errorf("user_id is not a valid string")
		}

		userID, err := uuid.Parse(userIDString)
		if err != nil {
			log.Println(err)
			return uuid.Nil, fmt.Errorf("invalid UUID format: %v", err)
		}

		return userID, nil
	}

	return uuid.Nil, nil
}

func VerifyGoogleIDToken(idToken string) (*idtoken.Payload, error) {
	// Verify the token (use one audience first for the initial check)
	payload, err := idtoken.Validate(context.Background(), idToken, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		log.Println("Error validating token:", err)
		return nil, err
	}

	// Check if the 'aud' claim matches one of the expected audiences
	validAudiences := []string{
		os.Getenv("GOOGLE_CLIENT_ID"),     // Android Client ID
		os.Getenv("GOOGLE_WEB_CLIENT_ID"), // Web Client ID
	}

	// Verify the audience claim
	isValidAudience := false
	for _, aud := range validAudiences {
		if payload.Audience == aud {
			isValidAudience = true
			break
		}
	}

	if !isValidAudience {
		return nil, fmt.Errorf("audience provided does not match any of the valid audiences")
	}

	return payload, nil
}
