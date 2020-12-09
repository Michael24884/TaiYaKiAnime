![](./examples/capture.gif)

# react-native-reanimated-slider


## motivation
The slider from the react-native is not good for video/audio players. If you slide it while the player is playing the file, It will jump a lot between where the file is playing right now and where your finger is, producing very bad UX. this libray uses `react-native-reanimated` and `react-native-gesture-hander`  to produce 60 fps animations and stops jumping the slider while sliding.


## install
first install and link `react-native-reanimated` and `react-native-gesture-hander` and then install this packeage. ( I know you can install this packeage first :) )

```
yarn add react-native-reanimated-slider
```
or 

```
npm i -s react-native-reanimated-slider
```

## Props
| prop                  | type            | description                                                                                                                                                                                                                              |
| --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| style                 | Object          | a style object to supply to container view                                                                                                                                                                                               |
| minimumTrackTintColor | String          | color to fill the progress in the seekbar                                                                                                                                                                                                |
| maximumTrackTintColor | String          | color to fill the background in the seekbar                                                                                                                                                                                              |
| cacheTrackTintColor   | String          | color to fill the cache in the seekbar                                                                                                                                                                                                   |
| borderColor           | String          | color of the seekbar's  border                                                                                                                                                                                                           |
| ballon                | (value)=>String | gets the value and returns a String for the ballon to display while sliding                                                                                                                                                              |
| progress              | Animated.Value  | the current value of the slider                                                                                                                                                                                                          |
| min                   | Animated.Value  | the minimum value of the slider                                                                                                                                                                                                          |
| cache                 | Animated.Value  | the cached value                                                                                                                                                                                                                         |
| max                   | Animated.Value  | the maximum value of the slider                                                                                                                                                                                                          |
| onSlidingStart        | ()=>void        | callback called when the users starts sliding                                                                                                                                                                                            |
| onSlidingComplete     | (value)=>void   | callback called when the users stops sliding                                                                                                                                                                                             |
| renderBallon          | ()=>React.Node  | returns a React node to render as a ballon                                                                                                                                                                                             |
| setBallonText         | text=>void      | if you use custom Ballon renderer you have to supply this prop to set the text inside the ballon. for better performance you better use a `TextInput` and setNativeProps. the `text` argument will be the output from the prop  `ballon`                                                                                                                                                                                              |
| renderThumbImage      | ()=>React.Node  | returns a React node to render as a slider thumb                                                                                                                                                                                             |                                                                 
| thumbOffset           | number          | offset for the thumb from the end of the seekbar



## Usage
```js
import Slider from 'react-native-reanimated-slider';
...
render(){
  return (
    <Slider
      style={{ flex: 1 }}
      minimumTrackTintColor="#fff"
      thumbTintColor="#fff"
      ballon={value => this.convertSecondToTime(value)}
      progress={this.currentTime}
      min={new Reanimated.Value(-0.0000000000000000001)}
      cache={this.playableDuration}
      max={this.seekableDuration}
      onSlidingStart={this.slidingStart}
      onSlidingComplete={this.slidingComplete}
    />
  )
}
```

## Ballon
```js
import {Ballon } from 'react-native-reanimated-slider';
...
renderBallon=({text})=>(
  <Ballon 
    text={text}
  >
)
```

## Ballon Props

| prop           | type   | description                         |
| -------------- | ------ | ----------------------------------- |
| containerStyle | Object | container style                     |
| color          | string | color of the ballon                 |
| textStyle      | Object | style of the text inside the ballon |


##  *Enjoy Sliding* :)
