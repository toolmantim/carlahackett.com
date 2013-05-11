cd `dirname $0`
echo "Files changed:"
git diff --name-only | cat
echo
echo "Describe the changes (e.g. 'Added a red button'): "
read message
git commit -au -m "$message" && \
git push && \
git push heroku
