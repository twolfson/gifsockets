var assert = require('assert');
var streamUtils = require('./utils/stream');
var imageUtils = require('./utils/image');
var Gifsocket = require('../');

describe('A connection to a gifsocket', function () {
  before(function () {
    this.gifsocket = new Gifsocket({
      height: 10,
      width: 10
    });
  });
  streamUtils.createWriteStream();
  before(function (done) {
    this.gifsocket.addListener(this.stream, done);
  });

  describe('writing an RGB frame', function () {
    before(function () {
      this._beforeFrameData = this.streamData;
      console.log(this.streamData.length);
    });

    it('receives a new frame', function () {

    });

    describe('and closing the image', function () {
      it('creates a GIF image', function () {
      });
    });
  });
});

// describe.skip('A conection to a gifsocket', function () {
//   openImage();
//   describe.skip('writing a first frame', function () {
//     imageUtils.load(__dirname + '/test-files/checkerboard.png');
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
