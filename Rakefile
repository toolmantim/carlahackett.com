sass_cmd = 'bundle exec sass scss/foxglove.scss:public/styles.css --sourcemap'

task :default => :compile
task(:compile) { sh sass_cmd }
task(:watch) { sh "#{sass_cmd} --watch" }
