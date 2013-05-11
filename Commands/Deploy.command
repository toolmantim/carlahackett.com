cd `dirname $0`

echo "Files changed:"
git status --porcelain
if [ $? -eq 0 ] ; then
  echo "Nothing to deploy!"
  exit 1
fi

echo "Describe the changes (e.g. 'Added a red button'): "
read message

git commit -au -m "$message" && \
git push && \
git push heroku
