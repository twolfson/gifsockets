var assert = require('assert');
var fs = require('fs');
var PassThrough = require('readable-stream').PassThrough;
var imageUtils = require('./utils/image');
var Gifsocket = require('../');

function writeRgbaFrame() {
  before(function (done) {
    this.gifsocket.writeRgbaFrame(this.rgbaPixels, done);
  });
}
function openGifsocket() {
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
}
function closeGifsocket() {
  before(function (done) {
    this.gifsocket.closeAll(done);
  });
}

describe('A connection to a gifsocket', function () {
  openGifsocket();
  describe('writing an RGB frame', function () {
    before(function saveFrameData () {
      this._beforeFrameData = this.streamData;
    });
    imageUtils.loadRgbaImage('checkerboard.png');
    writeRgbaFrame();

    it('receives a new frame', function () {
      assert.notEqual(this._beforeFrameData, this.streamData);
    });

    describe('and closing the image', function () {
      closeGifsocket();
      imageUtils.debug('single.gif');

      it('creates a GIF image', function () {
        var expectedImg = fs.readFileSync(__dirname + '/expected-files/single.gif', 'binary');
        assert.strictEqual(this.streamData, expectedImg);
      });
    });
  });
});

describe('A conection to a gifsocket', function () {
  openGifsocket();
  describe('writing a first frame', function () {
    imageUtils.loadRgbaImage('checkerboard.png');
    writeRgbaFrame();

    describe('and a second frame', function () {
      imageUtils.loadRgbaImage('checkerboard-inverse.png');
      writeRgbaFrame();
      closeGifsocket();
      imageUtils.debug('multiple.gif');

      it('receives both frames', function () {
        var expectedImg = fs.readFileSync(__dirname + '/expected-files/multiple.gif', 'binary');
        assert.strictEqual(this.streamData, expectedImg);
      });
    });
  });
});
