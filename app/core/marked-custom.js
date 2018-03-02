
'use strict';

const marked = require('joe-marked');
const debug = require('debug')('raneto');

var renderer = new marked.Renderer();

renderer.heading = function(text, level, raw) {
    return '<h'
      + level
      + ' id="'
      + encodeURIComponent(text)
      + '">'
      + text
      + '</h'
      + level
      + '>\n';
  };
exports.renderer = renderer;
exports.slugify = function (str) {
  // debug('str is: ' + str)
  return encodeURIComponent(str)
}
