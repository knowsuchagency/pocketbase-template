# Frontend dependencies stage - using Bun for speed
FROM oven/bun:1 AS frontend-deps

WORKDIR /app

# Copy frontend package files
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# Frontend build stage - using Node for React Router compatibility
FROM node:24-alpine AS frontend-builder

WORKDIR /app

# Copy dependencies from Bun stage
COPY --from=frontend-deps /app/node_modules ./node_modules

# Copy frontend source code and package files
COPY frontend .

# Build frontend with npm (React Router v7 works better with Node)
ENV NODE_ENV=production
RUN npm run build

# Backend build stage
FROM golang:1.25-alpine AS backend-builder

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
