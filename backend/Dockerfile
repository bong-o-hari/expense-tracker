# Base image for Go
FROM golang:1.23

# Set working directory
WORKDIR /

# Copy Go Modules and Install dependencies
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the source code
COPY . .

# Expose the port (if needed)
EXPOSE 8080

# Command to run the app
CMD ["go", "run", "main.go"]
