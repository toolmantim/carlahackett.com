cd `dirname $0`/..

echo
echo "Installing npm modules..."
echo

yarn install

echo
echo "Starting carlahackett.com (Ctrl-C to stop)..."
echo

env OPEN_BROWSER=1 yarn run start
