import React from 'react';

import { Provider } from 'react-redux'
import configureStore from './row/stores'

// import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
// import { Stopwatch, Timer } from 'react-native-stopwatch-timer'

import RowScreen from './row/RowScreen';

const store = configureStore()

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <RowScreen />
      </Provider>
    );
  }
}