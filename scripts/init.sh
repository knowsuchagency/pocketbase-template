#!/bin/bash

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Setting up superuser credentials..."
    
    # Force interactive mode by opening /dev/tty for both input and output
    exec < /dev/tty
    exec > /dev/tty
    
    # Read email
    printf "Enter superuser email: "
    read -r email
    
    # Read password (hidden)
    printf "Enter superuser password: "
    read -rs password
    echo # New line after password
    
    # Restore stdout to write to wherever mise expects
    exec > /dev/stdout
    
    # Use sed to replace the values in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SUPERUSER_EMAIL=.*/SUPERUSER_EMAIL=$email/" .env
        sed -i '' "s/SUPERUSER_PASSWORD=.*/SUPERUSER_PASSWORD=$password/" .env
    else
        # Linux
        sed -i "s/SUPERUSER_EMAIL=.*/SUPERUSER_EMAIL=$email/" .env
        sed -i "s/SUPERUSER_PASSWORD=.*/SUPERUSER_PASSWORD=$password/" .env
    fi
    
    echo "✅ .env file created with your credentials"
else
    echo "✅ .env file already exists"
fi