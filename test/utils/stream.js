var util = require('util');
var Writable = require('readable-stream').Writable;

function TestWritable() {
  Writable.apply(this, arguments);
}
util.inherits(TestWritable, Writable);
TestWritable.prototype._write = function (chunk, encoding, cb) {
  this.emit('data', chunk, encoding);
  cb();
};

exports.createWriteStream = function () {
  before(function () {
    this.stream = new TestWritable();
    this.streamData = '';
    this.stream.on('data', function (chunk) {
      this.streamData += chunk;
    });
  });
};