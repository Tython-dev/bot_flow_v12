#!/bin/bash
# Docker Deployment Script for Botpress v12
# Usage: ./deploy/docker-deploy.sh [build|start|stop|restart|logs|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_success "All requirements met"
}

setup_env() {
    if [ ! -f .env ]; then
        print_info "Creating .env file from template..."
        cp .env.example .env
        print_success ".env file created"
        print_info "Please edit .env file with your configuration"
        exit 0
    fi
}

build_images() {
    print_info "Building Docker images..."
    docker-compose build --no-cache
    print_success "Images built successfully"
}

start_services() {
    print_info "Starting services..."
    docker-compose up -d
    print_success "Services started"
    
    print_info "Waiting for services to be healthy..."
    sleep 10
    docker-compose ps
}

stop_services() {
    print_info "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

restart_services() {
    print_info "Restarting services..."
    docker-compose restart
    print_success "Services restarted"
}

show_logs() {
    docker-compose logs -f --tail=100
}

show_status() {
    print_info "Service Status:"
    docker-compose ps
    
    print_info "\nResource Usage:"
    docker stats --no-stream
    
    print_info "\nHealth Check:"
    curl -s http://localhost:3000/status | jq . || echo "Botpress not responding"
}

update_deployment() {
    print_info "Updating deployment..."
    
    # Pull latest code
    git pull origin botflow_elorchi
    
    # Rebuild
    build_images
    
    # Restart
    docker-compose up -d
    
    print_success "Deployment updated"
}

backup_data() {
    print_info "Creating backup..."
    
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    # Backup database
    docker-compose exec -T postgres pg_dump -U botpress botpress | gzip > $BACKUP_DIR/db_$DATE.sql.gz
    
    # Backup data directory
    tar -czf $BACKUP_DIR/data_$DATE.tar.gz ./data
    
    print_success "Backup created in $BACKUP_DIR"
}

# Main script
case "${1}" in
    build)
        check_requirements
        setup_env
        build_images
        ;;
    start)
        check_requirements
        setup_env
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    update)
        check_requirements
        update_deployment
        ;;
    backup)
        backup_data
        ;;
    *)
        echo "Botpress Docker Deployment Script"
        echo ""
        echo "Usage: $0 {build|start|stop|restart|logs|status|update|backup}"
        echo ""
        echo "Commands:"
        echo "  build   - Build Docker images"
        echo "  start   - Start all services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show service logs"
        echo "  status  - Show service status"
        echo "  update  - Pull latest code and redeploy"
        echo "  backup  - Create backup of database and data"
        exit 1
        ;;
esac

exit 0
