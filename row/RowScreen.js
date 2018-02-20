import React from 'react';

import { connect } from 'react-redux';
import { resetStopwatch, toggleStopwatch, locationChanged, tick, showModal, hideModal, accelerationChanged} from './actions/watch';
import { Accelerometer } from 'react-native-sensors';
import { StyleSheet, Text, View, TouchableHighlight, Modal, DeviceEventEmitter, Button, Image } from 'react-native';
import moment from 'moment';

import RNGLocation from 'react-native-google-location';

class RowScreen extends React.Component {
    constructor(props) {
        super(props);
        this.startStop = this.startStop.bind(this);
        this.tickFunction = this.tickFunction.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        if (!this.evEmitter) {
            this.evEmitter = DeviceEventEmitter.addListener('updateLocation', this.locationChanged.bind(this));
            RNGLocation.getLocation();
        }
        this.accelerationObservable = new Accelerometer({
            updateInterval: 100, // defaults to 100ms
          });
        this.accelerationObservable
            .map((acceleration) => {
                this.props.accelerationChanged(acceleration);
            });      
    }

    componentWillUnmount() {
        this.evEmitter.remove();
        this.accelerationObservable.stop();
    }

    locationChanged(e) {
        this.props.locationChanged(e);
    }

    tickFunction() {
        this.props.tick(this.props.start);
    }

    start() {
        this.props.toggleStopwatch(this.props.ellapsedSeconds);            
        this.interval = setInterval(this.tickFunction, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
        const splits = this.props.time.split(':');
        const ellapsedSeconds = parseInt(splits[0], 10) * 60 + parseInt(splits[1], 10);
        this.props.toggleStopwatch(ellapsedSeconds);
    }

    startStop() {
        if (!this.props.stopwatchStart) {
            this.start();
        } else {
            this.stop();
        }
    }

    resetStopwatch() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        const hasStarted = this.props.stopwatchStart;
        this.props.resetStopwatch();
        if (hasStarted) {
            // lap
            this.props.showModal();
            setTimeout(this.props.hideModal, 3000);
            this.start();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.time}</Text>
                <Text style={styles.text}>{this.props.speed}</Text>
                <Text style={styles.text}>{this.props.distance}m.</Text>
                <View style={styles.subContainer}>
                    <View style={styles.twoThirdContainer}>
                        <Text style={styles.text}>{this.props.strokeRate}</Text>
                        <Text style={styles.text}>{this.props.heartRate}</Text>
                    </View>
                    <View style={styles.container}>
                        <TouchableHighlight onPress={this.startStop}>
                            <Image style={styles.image} 
                                source={!this.props.stopwatchStart ? require('./img/play.png') : require('./img/pause.png')} />
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.resetStopwatch}>
                            <Image style={styles.image} 
                                source={require('./img/reset.png')} />
                        </TouchableHighlight>
                    </View>
                </View>
                <Modal visible={this.props.modalVisible}
                    animationType={'slide'}
                    onRequestClose={() => this.closeModal()}>
                    <View style={styles.modalContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.modalText}>You did {this.props.lapResume.distance} m. in {this.props.lapResume.time}.</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        alignSelf: 'stretch'
    },
    subContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    twoThirdContainer: {
        flex: 2
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 30,
        backgroundColor: '#FFf'
    },
    text: {
        flex: 1,
        textAlign: 'center',
        alignSelf: 'stretch',
        borderWidth: 0.5,
        borderColor: '#fff',
        fontSize: 70,
        color: '#fff'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    innerContainer: {
        alignItems: 'center',
        backgroundColor: '#000'
    },
    modalText: {
        fontSize: 30,
        color: '#fff'
    }
});

function mapStateToProps (state) {
    return {
        stopwatchStart: state.watch.stopwatchStart,
        stopwatchReset: state.watch.stopwatchReset,
        ellapsedSeconds: state.watch.ellapsedSeconds,
        distance: state.watch.distance,
        speed: state.watch.speed,
        time: state.watch.time,
        start: state.watch.start,
        modalVisible: state.watch.modalVisible,
        strokeRate: state.watch.strokeRate,
        heartRate: state.watch.heartRate,
        lapResume: state.watch.lapResume
    };
  }
  
  function mapDispatchToProps (dispatch) {
    return {
        resetStopwatch: () => dispatch(resetStopwatch()),
        toggleStopwatch: (ellapsedSeconds) => dispatch(toggleStopwatch(ellapsedSeconds)),
        locationChanged: (location) => dispatch(locationChanged(location)),
        tick: (start) => dispatch(tick(start)),
        showModal: () => dispatch(showModal()),
        hideModal: () => dispatch(hideModal()),
        accelerationChanged: (acceleration) => dispatch(accelerationChanged(acceleration))
    };
  }


export default connect(mapStateToProps, mapDispatchToProps)(RowScreen);