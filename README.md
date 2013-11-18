# gifsockets [![Build status](https://travis-ci.org/twolfson/gifsockets.png?branch=master)](https://travis-ci.org/twolfson/gifsockets)

Stream never-ending animated [GIFs][GIF]

Want to see `gifsockets` in action? See the demo:

http://console-log.2013.nodeknockout.com/

This is part of the [gifsockets][] project. It is used to create a common object where we streams can subscribe and frames can be written.

[GIF]: http://en.wikipedia.org/wiki/Graphics_Interchange_Format
[gifsockets]: https://github.com/twolfson/gifsockets-server

## Getting Started
Install the module with: `npm install gifsockets`

```javascript
var gifsocket = new require('gifsockets');
gifsocket.addListener(stream, [cb]);
// Pass back (err, handle)

// Write an image to one or all streams
// WARNING: YOUR DATA WILL BE MUTATED. PLEASE CLONE IT BEFORE HAND IF YOU ARE WORRIED ABOUT IT.
handle.writeRgbFrame([0, 0, 0, /*, ...*/], [cb]); // Array of rgba pixels
gifsocket.writeRgbFrame([0, 0, 0, /*, ...*/], [cb]); // Array of rgba pixels
// Pass back (err)

// TODO: Should we have a method for these?
// handle.writeRgbaFrame([0, 0, 0, 255/*, ...*/], [cb]);
// gifsocket.writeRgbaFrame([0, 0, 0, 255/*, ...*/], [cb]); // Array of rgba pixels

// Close a specific stream or all streams
handle.close([cb]);
gifsocket.closeAll([cb]);
// Pass back (err)
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

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
