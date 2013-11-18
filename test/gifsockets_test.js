var assert = require('assert');
var imageUtils = require('./utils/image');
var Gifsockets = require('../');

describe('A connection to a gifsocket', function () {
  describe('writing an RGB frame', function () {
    it('receives a new frame', function () {

    });

    describe('and closing the image', function () {
      it('creates a GIF image', function () {
      });
    });
  });
});

describe.skip('A conection to a gifsocket', function () {
  openImage();
  describe('writing a first frame', function () {
    imageUtils.load(__dirname + '/test-files/checkerboard.png');
    drawJsonFrame();

    describe('and a second frame', function () {
      imageUtils.load('checkerboard-inverse.png');
      drawJsonFrame();
      imageUtils.debug('multiple.png');
      closeImage();

      it('receives both frames', function () {
        var expectedImg = fs.readFileSync(__dirname + '/expected-files/multiple.gif', 'binary');
        assert.strictEqual(this.gifData, expectedImg);
      });
    });
  });
});
