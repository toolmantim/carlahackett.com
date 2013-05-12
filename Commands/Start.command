cd `dirname $0`/..

echo
echo "Starting the Foxglove site (Ctrl-C to stop)..."
echo

npm install && node node_modules/supervisor/lib/cli-wrapper.js app.js
