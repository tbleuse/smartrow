import {RESET_WATCH, TOGGLE_WATCH, LOCATION_CHANGED, TICK, SHOW_MODAL, HIDE_MODAL, ACCELERATION_CHANGED} from '../constants/watch';

export function resetStopwatch() {
    return {
        type: RESET_WATCH,
        payload: {}
    };
}

export function toggleStopwatch(ellapsedSeconds) {
    return {
        type: TOGGLE_WATCH,
        payload: {ellapsedSeconds}
    };
}

export function tick(start) {
    return {
        type: TICK,
        payload: {start}
    };
}

export function showModal() {
    return {
        type: SHOW_MODAL,
        payload: {}
    };
}

export function hideModal() {
    return {
        type: HIDE_MODAL,
        payload: {}
    };
}

export function locationChanged(location) {
    return {
        type: LOCATION_CHANGED, 
        payload: {location}
    };
}

export function accelerationChanged(acceleration) {
    return {
        type: ACCELERATION_CHANGED,
        payload: acceleration
    }
}