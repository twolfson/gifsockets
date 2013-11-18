var assert = require('assert');
var fs = require('fs');
var PassThrough = require('readable-stream').PassThrough;
var imageUtils = require('./utils/image');
var Gifsocket = require('../');

function writeRgbFrame() {
  before(function (done) {
    this.gifsocket.writeRgbFrame(this.rgbPixels, done);
  });
}

describe('A connection to a gifsocket', function () {
  before(function createGifsocket () {
    this.gifsocket = new Gifsocket({
      height: 10,
      width: 10
    });
  });
  before(function createListener (done) {
    var that = this;
    this.stream = new PassThrough();
    this.streamData = '';
    this.stream.on('data', function (buff) {
      that.streamData += buff.toString('binary');
    });
    this.gifsocket.addListener(this.stream, done);
  });

  describe('writing an RGB frame', function () {
    before(function saveFrameData () {
      this._beforeFrameData = this.streamData;
    });
    imageUtils.loadRgbImage('checkerboard.png');
    writeRgbFrame();

    it('receives a new frame', function () {
      assert.notEqual(this._beforeFrameData, this.streamData);
    });

    describe('and closing the image', function () {
      before(function (done) {
        this.gifsocket.closeAll(done);
      });
      imageUtils.debug('single.gif');

      it('creates a GIF image', function () {
        var expectedImg = fs.readFileSync(__dirname + '/expected-files/single.gif', 'binary');
        assert.strictEqual(this.streamData, expectedImg);
      });
    });
  });
});

// describe.skip('A conection to a gifsocket', function () {
//   openImage();
//   describe.skip('writing a first frame', function () {
//     drawJsonFrame();

//     describe('and a second frame', function () {
//       imageUtils.load('checkerboard-inverse.png');
//       drawJsonFrame();
//       imageUtils.debug('multiple.png');
//       closeImage();

//       it('receives both frames', function () {
//         var expectedImg = fs.readFileSync(__dirname + '/expected-files/multiple.gif', 'binary');
//         assert.strictEqual(this.gifData, expectedImg);
//       });
//     });
//   });
// });
