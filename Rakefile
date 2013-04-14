require 'fileutils'
require 'json'

task :default => :compile

task :precompile => :copy_components_as_scss

task :copy_components_as_scss do
  JSON.load(`bower list --sources`)[".css"].each do |css|
    scss = File.join 'scss', css.sub(/\.css\Z/,'.scss')
    next if File.exist?(scss)
    FileUtils.mkdir_p(File.dirname(scss))
    FileUtils.ln(css, scss)
  end
end

sass_cmd = 'bundle exec sass scss/styles.scss:public/styles.css --sourcemap'

task :compile => :precompile do
  sh sass_cmd
end
task :watch => :precompile do
  sh "#{sass_cmd} --watch"
end
