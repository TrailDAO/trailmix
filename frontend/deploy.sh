#!/bin/bash

# Build the app
echo "Building the app..."
npm run build

# Create deployment archive
echo "Creating deployment archive..."
cd dist
tar -czf ../trailmix-frontend.tar.gz .
cd ..

echo "Deployment files ready!"
echo "Upload trailmix-frontend.tar.gz to your Digital Ocean droplet"
echo ""
echo "On your droplet, run:"
echo "sudo mkdir -p /var/www/trailmix"
echo "sudo tar -xzf trailmix-frontend.tar.gz -C /var/www/trailmix"
echo "sudo chown -R www-data:www-data /var/www/trailmix"
echo ""
echo "Configure nginx to serve from /var/www/trailmix" 