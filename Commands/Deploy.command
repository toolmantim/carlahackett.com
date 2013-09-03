cd `dirname $0`

echo "Deploying Foxglove site (Ctrl-C to abort)..."
echo

test -n "$(git status --porcelain)"
if [ $? ] ; then
  echo "Files changed:"
  git status --porcelain

  echo
  echo "Describe the changes (e.g. 'Added a red button'): "
  read message

  git commit -au -m "$message"
fi

git push && \
git push heroku HEAD:master && \
echo && \
echo "All done!"
