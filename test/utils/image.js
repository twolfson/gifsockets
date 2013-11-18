var getPixels = require('get-pixels');

exports.load = function (filename) {
  before(function loadImage (done) {
    var that = this;
    getPixels(__dirname + '/../test-files/' + filename, function (err, pixels) {
      if (err) {
        return done(err);
      }
      that.pixels = pixels;
      done();
    });
  });
};

exports.debug = function (filename) {
  if (process.env.DEBUG_TEST) {
    before(function saveDebugImage () {
      try { fs.mkdirSync(__dirname + '/../actual-files/'); } catch (e) {}
      fs.writeFileSync(__dirname + '/../actual-files/' + filename, this.gifData, 'binary');
    });
  }
};