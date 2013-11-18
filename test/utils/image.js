var fs = require('fs');
var getPixels = require('get-pixels');
var GifEncoder = require('gif-encoder');

exports.load = function (filename) {
  before(function loadImage (done) {
    var that = this;
    getPixels(__dirname + '/../test-files/' + filename, function (err, pixels) {
      if (err) {
        return done(err);
      }
      that.rgbaPixels = pixels;
      done();
    });
  });
};

exports.loadRgbImage = function (filename) {
  exports.load(filename);
  before(function downgradeImage () {
    var gif = new GifEncoder(10, 10);
    this.rgbPixels = gif.removeAlphaChannel([].slice.call(this.rgbaPixels.data));
  });
};

exports.debug = function (filename) {
  if (process.env.DEBUG_TEST) {
    before(function saveDebugImage () {
      try { fs.mkdirSync(__dirname + '/../actual-files/'); } catch (e) {}
      fs.writeFileSync(__dirname + '/../actual-files/' + filename, this.streamData, 'binary');
    });
  }
};