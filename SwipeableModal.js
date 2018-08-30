// @flow

import * as React from 'react';
import { Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import memoize from 'memoize-one';

import styles from './style';

type Direction = 'top' | 'bottom' | 'left' | 'right';

type Props = {
  direction: Direction,
  children: React.Node,
  closeModal: Function,
  style?: any,
  panClose: number,
  minOffset: number,
  maxOffset: number,
};

export class SwipeableModal extends React.PureComponent<Props> {
  static defaultProps = {
    direction: 'bottom',
    panClose: 0.6,
    minOffset: 20,
    maxOffset: 80,
  };

  constructor(props) {
    super(props);
    this._translate = new Animated.Value(0);
    this._lastOffset = 0;
    // this._dismissed = false;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.direction !== this.props.direction) {
      this._translate = new Animated.Value(0);
      this._lastOffset = 0;
    }
  }

  getDirectionState = () => {
    const { width, height } = Dimensions.get('window');

    return {
      key: this.props.direction === 'top' || this.props.direction === 'bottom' ? 'Y' : 'X',
      screenSize: this.props.direction === 'top' || this.props.direction === 'bottom' ? height : width,
      multiplier: this.props.direction === 'bottom' || this.props.direction === 'right' ? 1 : -1
    };
  };

  onHandlerStateChange = event => {
    const { key } = this.getDirectionState(this.props.direction);

    if (event.nativeEvent.state === State.END) {
      this._lastOffset = 0;
      this._translate.setOffset(this._lastOffset);
      this._translate.setValue(0);
    } else if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset += event.nativeEvent[`translation${key}`];
      this._translate.setOffset(this._lastOffset);
      this._translate.setValue(0);
    }
  };

  getTranslationObject = memoize((direction: Direction) => {
    const { key } = this.getDirectionState(direction);
    return {
      onGestureEvent: Animated.event(
        [
          {
            nativeEvent: {
              [`translation${key}`]: this._translate,
            },
          },
        ],
        {
          useNativeDriver: true,
          listener: this.gestureListener
        }
      )
    };
  });

  gestureListener = (event) => {
    const { panClose, direction } = this.props;
    const { key, multiplier, screenSize } = this.getDirectionState(direction);

    if (/*!this._dismissed && */event.nativeEvent[`translation${key}`] * multiplier > screenSize * panClose) {
      // this._dismissed = true;
      this.props.closeModal();
    }
  };

  render() {
    const { children, style, direction, minOffset, maxOffset } = this.props;
    const { key, multiplier } = this.getDirectionState(direction);
    const { onGestureEvent } = this.getTranslationObject(direction);

    const deltas = {
      [`minOffset${key}`]: minOffset * multiplier,
      [`maxOffset${key}`]: maxOffset * multiplier,
    };

    return (
      <PanGestureHandler
        {...deltas}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={this.onHandlerStateChange}>
        <Animated.View
          style={[
            styles.container,
            style,
            {
              transform: [
                { [`translate${key}`]: this._translate },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
