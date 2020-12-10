# htmlparser2-without-node-native

[htmlparser2](https://github.com/fb55/htmlparser2) build that excludes node native modules so that you can use it in platforms like React Native.

* Remove `Stream` and `WritableStream`.
* Use [eventemitter2](https://github.com/asyncly/EventEmitter2) instead of native `events`.
