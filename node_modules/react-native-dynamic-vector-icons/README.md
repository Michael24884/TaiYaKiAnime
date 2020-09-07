<img alt="React Native Bottom Bar" src="https://github.com/WrathChaos/react-native-dynamic-vector-icons/blob/master/assets/logo.png" width="1050"/>

[![Battle Tested ✅](https://img.shields.io/badge/-Battle--Tested%20%E2%9C%85-03666e?style=for-the-badge)](https://github.com/WrathChaos/react-native-dynamic-vector-icons)

[![Wrapper of react-native-vector-icons to use dynamic types](https://img.shields.io/badge/-Wrapper%20of%20react--native--vector--icons%20to%20use%20dynamic%20types-lightgrey?style=for-the-badge)](https://github.com/WrathChaos/react-native-dynamic-vector-icons)

[![npm version](https://img.shields.io/npm/v/react-native-dynamic-vector-icons.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-dynamic-vector-icons)
[![npm](https://img.shields.io/npm/dt/react-native-dynamic-vector-icons.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-dynamic-vector-icons)
![expo-compatible](https://img.shields.io/badge/Expo-compatible-9cf.svg?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## Installation

Add the dependency:

### Pure React Native:

```ruby
npm i react-native-dynamic-vector-icons
```

### Expo Version:

```ruby
"react-native-dynamic-vector-icons": "WrathChaos/react-native-dynamic-vector-icons#expo"
```

## Peer Dependencies

##### IMPORTANT! You need install them.

```
"react": ">= 16.x",
"react-native": ">= 0.55.x",
"react-native-vector-icons": ">= 6.x.x"
```
## Import

```js
import Icon from "react-native-dynamic-vector-icons";
```

## Basic Usage

```jsx
<Icon name="github" type="AntDesign" size={30} color="purple" onPress={() => {}} />
```

## Bundled Icon Sets

[Browse all](https://oblador.github.io/react-native-vector-icons/).

- [`AntDesign`](https://ant.design/) by AntFinance (**297** icons)
- [`Entypo`](http://entypo.com) by Daniel Bruce (**411** icons)
- [`EvilIcons`](http://evil-icons.io) by Alexander Madyankin & Roman Shamin (v1.10.1, **70** icons)
- [`Feather`](http://feathericons.com) by Cole Bemis & Contributors (v4.21.0, **279** icons)
- [`FontAwesome`](http://fortawesome.github.io/Font-Awesome/icons/) by Dave Gandy (v4.7.0, **675** icons)
- [`FontAwesome 5`](https://fontawesome.com) by Fonticons, Inc. (v5.7.0, 1500 (free) **5082** (pro) icons)
- [`Fontisto`](https://github.com/kenangundogan/fontisto) by Kenan Gündoğan (v3.0.4, **615** icons)
- [`Foundation`](http://zurb.com/playground/foundation-icon-fonts-3) by ZURB, Inc. (v3.0, **283** icons)
- [`Ionicons`](https://ionicons.com/) by Ben Sperry (v4.2.4, **696** icons)
- [`MaterialIcons`](https://www.google.com/design/icons/) by Google, Inc. (v3.0.1, **932** icons)
- [`MaterialCommunityIcons`](https://materialdesignicons.com/) by MaterialDesignIcons.com (v4.0.96, **4416** icons)
- [`Octicons`](http://octicons.github.com) by Github, Inc. (v8.4.1, **184** icons)
- [`Zocial`](http://zocial.smcllns.com/) by Sam Collins (v1.0, **100** icons)
- [`SimpleLineIcons`](https://simplelineicons.github.io/) by Sabbir & Contributors (v2.4.1, **189** icons)

### Configuration - Props

| Property |   Type   |  Default  | Description                                      |
| -------- | :------: | :-------: | ------------------------------------------------ |
| style    |  style   |   style   | use this to change the Icon's style              |
| name     |  string  |   null    | use this to change icon's itself                 |
| type     |  string  |   null    | set the icon's type                              |
| size     |  number  |   null    | changes the icon's size                          |
| color    |  color   |   null    | use this to change icon's color                  |
| onPress  | function | undefined | use this to set the icon's onPress functionality |

### Credits

Special thanks to [oblador, react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) to make a great icon library :) This library is a little wrapper for react-native-vector-icons to make their icon type dynamically.

## Author

FreakyCoder, kurayogun@gmail.com

## License

React Native Dynamic Vector Icons Library is available under the MIT license. See the LICENSE file for more info.
)
