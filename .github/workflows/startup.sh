#!/bin/sh

# Start Nginx
nginx -g 'daemon off;' &

# Start Node.js API
node /home/site/wwwroot/api/src/server.js