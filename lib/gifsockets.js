var assert = require('assert');
var gifEncoder = require('gifEncoder');
function noop() {}

function Gifsockets(options) {
  // Assert we have a height and width
  var width = options.width;
  var height = options.height;
  assert(width, 'Width was not provided for gifsockets');
  assert(height, 'Height was not provided for gifsockets');

  // Save options
  this.width = width;
  this.height = height;

  // Create listeners for later
  this.firstListeners = [];
  this.secondListeners = [];
}
Gifsockets.prototype = {
  createGif: function () {
    return new GifEncoder(this.width, this.height);
  },
  addListener: function (stream, cb) {
    // Write out the header info
    // DEV: It would be nice to write out image info here too (e.g. width x height)
    var gif = this.createGif();
    var that = this;
    gif.on('data', function getHeader (buff) {
      // Clean up our GIF and write out the info
      gif.removeAllListeners();
      stream.write(buff);

      // Add the response to our list of open connections
      that.firstConnections.push({
        stream: stream
      });

      // TODO: Callback with a handle for writing directly to this listener
      (cb || noop)(null);
    });
    gif.writeHeader();
  }
};

module.exports = Gifsockets;