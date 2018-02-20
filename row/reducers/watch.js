import moment from 'moment';

import Location from '../utils/location';

import {RESET_WATCH, TOGGLE_WATCH, GET_TIME, LOCATION_CHANGED, TICK, SHOW_MODAL, HIDE_MODAL, ACCELERATION_CHANGED} from '../constants/watch';


const initialState = {
    stopwatchStart: false,
    stopwatchReset: false,
    locations: {
        current: {
            location: null,
            time: null,
        },
        previous: {
            location: null,
            time: null
        }

    },
    speed: '00:00',
    start: moment(),
    ellapsedSeconds: 0,
    time: '00:00',
    distance: 0,
    modalVisible: false,
    strokeRate: 0,
    acceleration: {
        current: {
            data: null,
            time: null
        },
        previous: {
            data: null,
            time: null
        }
    },
    heartRate: 0,
    lapResume: {
        distance: null,
        time: null
    }
};

export default function watchReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_WATCH:
            return Object.assign({}, state, {
                stopwatchStart: !state.stopwatchStart, 
                ellapsedSeconds: action.payload.ellapsedSeconds,
                start: moment()
            });
            break;
        case RESET_WATCH:
            return {...initialState, lapResume: {
                distance: state.distance,
                time: state.time
            }};
            break;
        case TICK:
            const time = moment(moment().diff(action.payload.start))
            .add(state.ellapsedSeconds, 'seconds').format('mm:ss');
            let speed = '00:00';
            let distance = state.distance;
            if ((state.locations.previous.location !== null && state.locations.current.location !== null) 
                && !Location.equals(state.locations.current.location, state.locations.previous.location)) {
                let newDistance = Location.getDistanceBetween(state.locations.previous.location, state.locations.current.location);
                distance += Math.round(newDistance);
                if (state.locations.previous.time != null && state.locations.current.time !== null) {
                    const msDiff = state.locations.current.time.diff(state.locations.previous.time);
                    const newSpeed = newDistance / (msDiff / 1000);
                    speed = Location.convertSpeed(newSpeed);
                }
            }
            return Object.assign({}, state, {
                time,
                distance,
                speed
            });
            break;
        case LOCATION_CHANGED:
            if (action.payload.location) {
                console.log(action.payload);
                const newLocations = {
                    current: {
                        location: action.payload.location,
                        time: moment()
                    },
                    previous: state.locations.current
                }
                return Object.assign({}, state, {
                    locations: newLocations
                });
            } else {
                return state;
            }
        case SHOW_MODAL:
            return {...state, modalVisible: true };
        case HIDE_MODAL:
            return {...state, modalVisible: false };
        case ACCELERATION_CHANGED:
            const newAcceleration = {
                previous: state.acceleration.current,
                current: {
                    data: action.payload.acceleration,
                    time: moment()
                }
            };
            let strokeRate = state.strokeRate;
            if (newAcceleration.previous.time !== null) {
                const msDiff = newAcceleration.current.time.diff(newAcceleration.previous.time);
                if (msDiff > 100) {
                    const speed = Math.abs((newAcceleration.current.data.x + newAcceleration.current.data.y + newAcceleration.current.data.z) 
                    - (newAcceleration.previous.data.x + newAcceleration.previous.data.y + newAcceleration.previous.data.z))  / diffTime * 10000;
                    if (speed > 600) {
                        strokeRate = Math.abs(60000 / msDiff);
                    }
                }
            }
            return Object.assign({}, state, {
                acceleration: newAcceleration,
                strokeRate
            });
        default:
            return state;
    }
}