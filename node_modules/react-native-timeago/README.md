# react-native-timeago

[![View package on npm](https://img.shields.io/npm/v/react-native-timeago.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/react-native-timeago) [![npm](https://img.shields.io/npm/dm/react-native-timeago.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/react-native-timeago) ![Build status](https://travis-ci.org/tylerlh/react-native-timeago.svg?branch=master)

An auto-updating timeago component for React Native using [moment.js](http://momentjs.com/).

## Usage

```jsx
import React, { Component } from 'react';
import TimeAgo from 'react-native-timeago';

// Timestamp can be any valid data type accepted in a Moment.js constructor
// Currently accepts string, number, array, or a Date instance
let timestamp = "2015-06-21T06:24:44.124Z";

class MyComponent extends Component {

  ...

  render() {
    return (
      <TimeAgo time={timestamp} />
    )
  }

  ...
};
```

If you'd like to hide the string "ago" from the phrase returned, you can use the hideAgo prop:


```jsx
<TimeAgo time={timestamp} hideAgo={true} />
```

All normal Text props are applicable (including style). Use the `interval` prop to change the update interval in milliseconds (default: 60000).

```jsx
// This component would update every 20 seconds
<TimeAgo time={timestamp} interval={20000} />
```

## Support local language
To support local language, you need to require locale language file, and call `moment.locale()` in your app.
For example
```jsx
let TimeAgo = require('react-native-timeago');

let moment = require('moment'); //load moment module to set local language
require('moment/locale/zh-cn'); //for import moment local language file during the application build
moment.locale('zh-cn');//set moment local language to zh-cn
...
```


## Contributing

If you'd like to see something added or changed to this module please open a new GitHub issue. Pull requests are always welcome.

## Author
Created and maintained by [Tyler Hughes](https://twitter.com/iampbt).
Contributions by [these fine folks](https://github.com/TylerLH/react-native-timeago/graphs/contributors).

## License
Copyright (c) 2015-2018, Tyler Hughes <iampbt@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
