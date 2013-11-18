var assert = require('assert');
var GifEncoder = require('gif-encoder');
function noop() {}

function Gifsocket(options) {
  // Assert we have a height and width
  var width = options.width;
  var height = options.height;
  assert(width, 'Width was not provided for gifsockets');
  assert(height, 'Height was not provided for gifsockets');

  // Save options
  this.width = width;
  this.height = height;

  // Create connections for later
  this.firstConnections = [];
  this.secondConnections = [];
}
Gifsocket.prototype = {
  createGif: function () {
    return new GifEncoder(this.width, this.height);
  },
  addListener: function (stream, cb) {
    // Write out the header info
    // DEV: It would be nice to write out image info here too (e.g. width x height)
    // DEV: Unfortunately, we write out global color pallete before width x height
    // DEV: meaning we would need the first frame before we can do that =(
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

      // TODO: Callback with a handle for writing directly to this connection
      (cb || noop)(null);
    });
    gif.writeHeader();
  },
  writeRgbFrame: function (pixels, cb) {
    // DEV: These are inline to avoid `.bind` calls
    // TODO: Which is more performant, scope resolution or context binding?
    var firstConnections = this.firstConnections;
    var secondConnections = this.secondConnections;
    function writeToFirstConnections(buff) {
      firstConnections.forEach(function writeToFirstConnection (conn) {
        conn.stream.write(buff);
      });
    }
    function writeToSecondConnections(buff) {
      secondConnections.forEach(function writeToSecondConnection (conn) {
        conn.stream.write(buff);
      });
    }

    // Create a gif for ourselves
    var gif = this.createGif();

    // Process the image (addFrame#1)
    gif.setImagePixels(pixels);
    gif.analyzePixels();

    // Write out the image info for the first connections (addFrame#2)
    gif.on('data', writeToFirstConnections);
    gif.writeImageInfo();
    gif.flushData();

    // Write out the image info for the second connections (addFrame#2)
    gif.removeListener('data', writeToFirstConnections);
    gif.on('data', writeToSecondConnections);
    gif.writeImageInfo();
    gif.flushData();

    // Write out the image itself for all connections (addFrame#3)
    gif.on('data', writeToFirstConnections);
    gif.outputImage();
    gif.flushData();

    // Clean up event connections
    gif.removeAllListeners();

    // Move all firstConnections to secondConnections
    secondConnections.push.apply(secondConnections, firstConnections);
    firstConnections.splice(0, firstConnections.length);

    // Callback
    (cb || noop)(null);
  },
  writeRgbaFrame: function (rgbaPixels, cb) {
    var gif = this.createGif();
    var rgbPixels = gif.removeAlphaChannel(rgbaPixels);
    this.writeRgbFrame(rgbPixels, cb);
  },
  closeAll: function (cb) {
    // Remove and save the open connections
    var connections = this.firstConnections.concat(this.secondConnections);
    this.firstConnections.splice(0, this.firstConnections.length);
    this.secondConnections.splice(0, this.secondConnections.length);

    // Write footer
    var gif = this.createGif();
    gif.on('data', function getFooter (buff) {
      // Clean up our GIF and write out footer
      gif.removeAllListeners();
      connections.forEach(function writeFooter (conn) {
        conn.stream.end(buff);
      });

      // Callback
      (cb || noop)(null);
    });
    gif.finish();
  }
};

module.exports = Gifsocket;