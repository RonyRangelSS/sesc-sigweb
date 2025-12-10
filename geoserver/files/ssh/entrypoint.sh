#!/bin/sh
set -e

echo "Starting SSH server..."
service ssh start
echo "SSH server started!"

echo "Starting Geoserver..."
exec bash /opt/startup.sh
echo "Geoserver started!"