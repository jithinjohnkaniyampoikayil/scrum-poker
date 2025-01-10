#!/bin/sh

# Copy custom nginx configuration file to the default location
cp /home/site/wwwroot/nginx-azure.conf /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;' &
