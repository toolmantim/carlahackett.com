cd `dirname $0`/..

echo
echo "Installing npm modules..."
echo

npm install --no-save

echo
echo "Starting carlahackett.com (Ctrl-C to stop)..."
echo

env OPEN_BROWSER=1 npm run start
