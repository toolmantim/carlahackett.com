cd `dirname $0`

echo "Deploying Foxglove site (Ctrl-C to abort)..."
echo

test -n "$(git status --porcelain)"
if [ $? -ne 0 ] ; then
  echo "Nothing to deploy!"
  exit 1
fi

echo "Files changed:"
git status --porcelain

echo
echo "Describe the changes (e.g. 'Added a red button'): "
read message

git commit -au -m "$message" && \
git push && \
git push heroku
