cd `dirname $0`/..

echo
echo "Starting the Foxglove site (Ctrl-C to stop)..."
echo

env OPEN_BROWSER=1 node node_modules/supervisor/lib/cli-wrapper.js -q app.js
