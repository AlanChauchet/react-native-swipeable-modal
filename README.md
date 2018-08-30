[//]: # (<a href="https://nodei.co/npm/:url/">
  <img src="https://nodei.co/npm/:url.svg?downloads=true&downloadRank=true&stars=true">
</a>)
[//]: # (<p>
  <a href="https://badge.fury.io/js/:url">
    <img src="https://badge.fury.io/js/:url.svg" alt="npm version" height="18">
  </a>
  <a href="https://npmjs.org/:url">
    <img src="https://img.shields.io/npm/dm/:url.svg" alt="npm downloads" height="18">
  </a>
</p>)

### React Native Swipeable Modal 

react-native-swipeable-modal is a JavaScript library for react-native allowing you to display modals which can be swiped away in any direction

It uses the great `react-native-gesture-handler` to handle the pan events. This module needs to be installed within your application for `react-native-swipeable-modal` to work.
For details please check [React Native Gesture Handler](https://kmagiera.github.io/react-native-gesture-handler/).

## Installation

React Native Swipeable Modal is available as `react-native-swipeable-modal` package on [npm](https://www.npmjs.com/)

With npm

```bash
$ npm install react-native-swipeable-modal --save
```

If using yarn

```bash
$ yarn add react-native-swipeable-modal
```

## Examples

`react-native-swipeable-modal` exports a `SwipeableModal` component which displays its children in a fullscreen mode and can then be swiped away.<br/>
You can use `SwipeableModal` in any direction:

### Use as a simple modal

```jsx
import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import { SwipeableModal } from 'react-native-swipeable-modal';

class Container extends Component {
  state = {
    showModal: false,
  };

  closeModal = () => this.setState({ showModal: false });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center, backgroundColor: '#FFFFFF' }}>
          <Button title="Show Modal" onPress={() => this.setState({ showModal: true })} />
        </View>
        {this.state.showModal && <SwipeableModal
          closeModal={this.closeModal}
          style={{
            backgroundColor: '#888888',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button title="Close" raised onPress={this.closeModal} />
        </SwipeableModal>}
      </View>
    );
  }
}
```

### Or with [React Native Navigation v2](https://wix.github.io/react-native-navigation/v2/#/) `showModal`

`registerScreen.js`
```jsx
import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ContainerScreen } from './ContainerScreen';
import { ModalScreen } from './ModalScreen';

Navigation.registerComponent(`navigation.Container`, () => ContainerScreen);
Navigation.registerComponent(`navigation.Modal`, () => gestureHandlerRootHOC(ModalScreen));
```

`ContainerScreen.js`
```jsx
import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import { Navigation } from 'react-native-navigation';

class ContainerScreen extends Component {
  showModal = () => {
    Navigation.showModal({
    component: {
        name: 'navigation.Modal',
        options: {
          modalPresentationStyle: Platform.OS === 'ios' ? 'overFullScreen' : 'overCurrentContext' // 'overfullScreen' on IOS allows us to see the back content while swiping the modal
        }
      }
    });
  };

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Show Modal" onPress={this.showModal} />
        </View>
    );
  }
}
```

`ModalScreen.js`
```jsx
import React, {Component} from 'react';
import { Text, Button } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { SwipeableModal } from 'react-native-swipeable-modal';

export class ModalScreen extends Component {
  closeModal = () => {
    Navigation.dismissModal(this.props.componentId)
      .catch(() => 1));
  };

  render() {
    return (
      <SwipeableModal
        closeModal={this.closeModal}
        style={{
          backgroundColor: '#999999',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button title="Close" onPress={this.closeModal} />
      </SwipeableModal>
    );
  }
}
```

## API

| Parameter      |   Type   | Required |  Default | Description                                                                                                |
|----------------|----------|----------|----------|------------------------------------------------------------------------------------------------------------|
| direction      | string   | ✘        | "bottom" | One of `"bottom"`, `"top"`, `"left"`, `"right"`|
| closeModal     | Function | ✓        | -        | The function to call when the modal has been swiped away beyond it's limit|
| style          | Object   | ✘        | -        | A style to overload the default style of the modal container. Note that you cannot overload the translate properties|
| panClose       | number   | ✘        | 0.6      | A number between 0 and 1 used to select the breakpoint at which `closeModal` will be called|
| minOffset      | number   | ✘        | 20       | See [`react-native-gesture-handler` minOffset](https://kmagiera.github.io/react-native-gesture-handler/docs/handler-pan.html#minoffsetx)|
| maxOffset      | number   | ✘        | 80       | See [`react-native-gesture-handler` maxOffset](https://kmagiera.github.io/react-native-gesture-handler/docs/handler-pan.html#maxoffsetx)|
