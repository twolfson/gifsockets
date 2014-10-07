# gifsockets [![Build status](https://travis-ci.org/twolfson/gifsockets.png?branch=master)](https://travis-ci.org/twolfson/gifsockets)

Stream never-ending animated [GIFs][GIF]

This is part of the [gifsockets][] project. It creates a [mediator][] for streams to subscribe to as new [GIF][] frames are written.

Want to see `gifsockets` in action? See the demo:

http://gifsockets.twolfson.com/

[GIF]: http://en.wikipedia.org/wiki/Graphics_Interchange_Format
[gifsockets]: https://github.com/twolfson/gifsockets-server
[mediator]: http://en.wikipedia.org/wiki/Mediator_pattern

## Getting Started
Install the module with: `npm install gifsockets`

```javascript
// Pass any writable stream as a listener to gifsocket
var gifsocket = new require('gifsockets');
gifsocket.addListener(stream, function (err) {
  // Write a new GIF frame to the stream
  // WARNING: YOUR DATA WILL BE MUTATED.
  // PLEASE CLONE IT BEFORE HAND IF YOU ARE WORRIED ABOUT IT.
  var rgbPixels = [0, 0, 0, /*, ...*/];
  gifsocket.writeRgbFrame(rgbPixels, function (err) {
    // Close the stream
    gifsocket.closeAll();
  });
});
```

## Documentation
`gifsockets` exposes a constructor `Gifsocket` function as its `module.exports`.

### `new Gifsocket(options)`
Constructor for a `Gifsocket`

- options `Object`
    - options.width `Number` - Width of the output GIF
    - options.height `Number` - Height of the output GIF

### `gifsocket.addListener(stream, [cb])`
Subscribe a [writable stream][wstream] to the stream of outgoing GIF frames

- stream `WritableStream` - [Writable stream][wstream] to write GIF information to
- cb `Function` - Optional error-first callback to run once the stream has received the [GIF][] header
    - Signature should look like `function (err) {}`

[wstream]: http://nodejs.org/api/stream.html#stream_class_stream_writable

### `gifsocket.writeRgbFrame(rgbPixels, [cb])`
Write a new RGB based frame to all of the current subscribers

**IF YOU USE THIS METHOD, IT WILL MUTATE `rgbPixels`.**

**PLEASE CLONE YOUR DATA IF YOU ARE WORRIED ABOUT CORRUPTION.**

- rgbPixels `Number[]` - Array of rgb pixels of the new frame
    - This should be the the same length as `width * height * 3`
    - `[0, 10, 20, 30, 40, 50]` represents 2 pixels; the first, `r: 0, g: 10, b: 20`; the second, `r: 30, g: 40, b: 50`
- cb `Function` - Optional error-first callback to run once the frame has been drawn to all listeners
    - Signature should look like `function (err) {}`

### `gifsocket.writeRgbaFrame(rgbaPixels, [cb])`
Write a new RGBA based frame to all subscribers

- rgbaPixels `Number[]` - Array of rgba pixels for the next frame
    - Length should be `width * height * 4`
    - `[0, 10, 20, 30, 40, 50, 60, 70]` represents 2 pixels; the first, `r: 0, g: 10, b: 20, a: 30`; the second, `r: 40, g: 50, b: 60, a: 70`

### `gifsocket.closeAll([cb])`
Write GIF footer to all open listeners and close them

- cb `Function` - Optional error-first callback to run once the footer has written to all listeners
    - Signature should look like `function (err) {}`

## Frequently asked questions
### Why is this not on streams?
A streaming interface does not quite line up with what happens here. `gifsockets` that are receiving their first frame **will not** receive the same data as their second frame counterparts. As a result, a `data` event or `read` does not make sense as all listeners/readers are indistinguishable.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Nov 18 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
