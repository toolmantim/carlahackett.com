require 'sass/importers'

# = SASS CSS Importer
#
# This overrides the Filesystem importer, which is used by Sass to @import
# .sass and .scss files from the filesystem, to include .css files as well.
#
# Once require'd, you can import a "some-stylesheet.css" file by simply doing:
#
#   @import "some-stylesheet";
#
# This works because CSS is a valid subset of SCSS, and can be imported just
# like any other SCSS file, including full sourcemap support.
#
# In the future SASS (some time after 3.3.0) will support an alternative to
# the @import directive which will provide this behaviour.
#
# https://github.com/nex3/sass/issues/556
#
# == Bower example
#
# You can use this in combination with load paths to import CSS files from
# bower compontents:
#
#
#   $ bower install normalize
#   $ bower ls --sources
#   {
#     ".css": [
#      "components/normalize-css/normalize.css"
#     ]
#   }
#   $ echo '@import "normalize-css/normalize";' > styles.scss
#   $ scss --require sass_css_importer --load-path components styles.scss style.css
#
# == Grunt with Bower and sourcemaps example
#
#   sass: {
#     styles: {
#       options: {
#         require: './sass/sass_css_importer',
#         loadPath: 'components',
#         sourcemap: true
#       },
#       files: {
#         'public/styles.css': 'sass/styles.scss'
#       }
#     }
#   }
class Sass::Importers::Filesystem
  protected
    alias :extensions_without_css :extensions
    def extensions
      extensions_without_css.merge('css' => :scss)
    end
end