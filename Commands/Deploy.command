cd `dirname $0`/..

echo "Deploying carlahackett.com (Ctrl-C to abort)..."
echo

if [ -n "$(git status --porcelain)" ]; then
  echo "Files changed:"
  git status --porcelain

  echo
  echo "Describe the changes (e.g. 'Added a red button'): "
  read message

  git add . -u && \
  git commit -m "$message"
fi

git push && \
git push heroku HEAD:master && \
echo && \
echo "All done!"
