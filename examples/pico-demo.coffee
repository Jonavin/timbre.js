# Binder of pico.js style generator
# http://mohayonao.github.com/pico.js/index.html

T = require '..'
require '../libs/pico-binder'

demo = require '../misc/demo'

T('pico.js', {gen:demo()}).play()
