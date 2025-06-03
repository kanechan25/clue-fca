#!/bin/bash
# Usage: ./deploy.sh

set -e  # Exit on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi

    print_success "Docker is running!"
}

check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    print_success "Docker Compose is available!"
}

cleanup() {
    print_status "Cleaning up existing containers..."
    
    if docker-compose ps -q | grep -q .; then
        print_status "Stopping existing containers..."
        docker-compose down --remove-orphans
    fi

    if docker images -f "dangling=true" -q | grep -q .; then
        print_status "Removing dangling images..."
        docker images -f "dangling=true" -q | xargs docker rmi || true
    fi

    print_success "Cleanup completed!"
}

deploy() {
    print_status "Building and deploying the application..."
    
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting containers..."
    docker-compose up -d
    
    print_status "Waiting for application to be healthy..."
    sleep 10
    
    if docker-compose ps | grep -q "Up"; then
        print_success "Application deployed successfully!"
        print_status "Application is running at: http://localhost:3000"
        print_status "Health check endpoint: http://localhost:3000/health"
    else
        print_error "Deployment failed! Container is not running."
        docker-compose logs
        exit 1
    fi
}

show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f --tail=50
}

show_status() {
    print_status "Application status:"
    docker-compose ps
    echo
    print_status "Container logs (last 10 lines):"
    docker-compose logs --tail=10
}

main() {
    echo "🚀 Clue FCA App Deployment Script"
    echo "=================================="
    
    check_docker
    check_docker_compose
    
    cleanup
    
    deploy
    
    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    print_status "Available commands:"
    echo "  View logs:    docker-compose logs -f"
    echo "  Stop app:     docker-compose down"
    echo "  Restart:      docker-compose restart"
    echo "  Status:       docker-compose ps"
    echo
    
    read -p "Do you want to view live logs? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        show_logs
    else
        show_status
    fi
}

case "${1:-}" in
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "stop")
        print_status "Stopping application..."
        docker-compose down
        print_success "Application stopped!"
        ;;
    "restart")
        print_status "Restarting application..."
        docker-compose restart
        print_success "Application restarted!"
        ;;
    "clean")
        cleanup
        ;;
    *)
        main
        ;;
esac 