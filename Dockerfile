# Frontend build stage
FROM oven/bun:1 AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# Copy frontend source code
COPY frontend .

# Build frontend
ENV NODE_ENV=production
RUN bun run build

# Backend build stage
FROM golang:1.24-alpine AS backend-builder

WORKDIR /build

# Install build dependencies
RUN apk add --no-cache ca-certificates

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 go build -o pocketbase main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ca-certificates

# Copy binary from backend builder
COPY --from=backend-builder /build/pocketbase .

# Copy frontend build output
COPY --from=frontend-builder /app/build ./frontend/build

# Create data directory
RUN mkdir -p /app/pb_data

# Expose PocketBase port
EXPOSE 8090

# Run PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]