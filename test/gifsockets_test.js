var assert = require('assert');
var fs = require('fs');
var PassThrough = require('readable-stream').PassThrough;
var imageUtils = require('./utils/image');
var Gifsocket = require('../');

function writeRgbFrame() {
  before(function (done) {
    console.log(this.rgbPixels.length);
    this.gifsocket.writeRgbFrame(this.rgbPixels, function () {
      setTimeout(function () {
        done();
      }, 1000);
    });
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
      console.log(buff);
      that.streamData += buff;
    });
    this.gifsocket.addListener(this.stream, function () {
      setTimeout(function () {
        done();
      }, 1000);
    });
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
        this.gifsocket.closeAll(function () {
          setTimeout(function () {
            console.log('closed');
            done();
          }, 1000);
        });
      });
      imageUtils.debug('single.gif');

      it('creates a GIF image', function () {
        // var expectedImg = fs.readFileSync(__dirname + '/expected-files/single.gif', 'binary');
        // assert.strictEqual(this.streamData, expectedImg);
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
