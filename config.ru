use Rack::Static, 
  :urls => Dir.chdir("public") { Dir["*"].map {|s| "/#{s}" } },
  :root => "public"

run lambda { |env|
  if env['PATH_INFO'] == '/'
    [200, {'Content-Type' => 'text/html' }, File.open('public/index.html', File::RDONLY)]
  else
    [404, {'Content-Type' => 'text/html' }, 'WRONG WAY GO BACK']
  end
}
