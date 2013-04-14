use Rack::Static,
  :urls => Dir.chdir("public") { Dir["*"].map {|s| "/#{s}" } },
  :root => "public"

run lambda { |env|
  req = Rack::Request.new(env)
  if req.host == "www.foxglovelettering.com"
    redirect_to = "http://foxglovelettering.com#{req.fullpath}"
    [301, {'Content-Type' => 'text/html', 'Location' => redirect_to}, "You are being redirected to #{redirect_to}"]
  elsif req.fullpath == "/"
    [200, {'Content-Type' => 'text/html'}, File.open('public/index.html', File::RDONLY)]
  else
    [404, {'Content-Type' => 'text/html'}, ['WRONG WAY GO BACK']]
  end
}
