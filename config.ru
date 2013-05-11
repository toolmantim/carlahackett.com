# Redirects requests from www.somewhere.com to somewhere.com
class WwwHostRedirector
  def initialize(app)
    @app = app
  end
  def call(env)
    if env["HTTP_HOST"] =~ /\Awww\.(.*)/
      redirect_to = "http://#{$1}#{env["PATH_INFO"]}/"
      [301, {'Content-Type' => 'text/html', 'Location' => redirect_to}, ["You are being redirected to #{redirect_to}"]]

    else
      @app.call(env)
    end
  end
end

# Redirects /some-page to /some-page/ if a matching /some-page/index.html file exists in public
class DirectoryRedirector
  def initialize(app)
    @app = app
  end
  def call(env)
    path = env["PATH_INFO"]
    if path !~ /\/\Z/ && File.exist?(File.join('public', path, 'index.html'))
      redirect_to = "http://#{env['HTTP_HOST']}#{path}/"
      [301, {'Content-Type' => 'text/html', 'Location' => redirect_to}, ["You are being redirected to #{redirect_to}"]]
    else
      @app.call(env)
    end
  end
end

# Rewrites PATH_INFO adding index.html for requests ending in /
class IndexFileMiddleware
  def initialize(app)
    @app = app
  end
  def call(env)
    if env["PATH_INFO"][-1..-1] == "/"
      env["PATH_INFO"] += "index.html"
    end
    @app.call(env)
  end
end

use WwwHostRedirector
use DirectoryRedirector
use IndexFileMiddleware

use Rack::Static,
  :urls => Dir.chdir("public") { Dir["*"].map {|s| "/#{s}" } },
  :root => "public"

run lambda { |env|
  [404, {'Content-Type' => 'text/html'}, ['WRONG WAY GO BACK']]
}