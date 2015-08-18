cd `dirname $0`/..

echo
echo "Installing npm modules..."
echo

npm install

echo
echo "Starting carlahackett.com (Ctrl-C to stop)..."
echo

env OPEN_BROWSER=1 node node_modules/supervisor/lib/cli-wrapper.js -q app.js
