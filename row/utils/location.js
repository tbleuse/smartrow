export default class Location {
    static getDistanceBetween(locationPrev, locationNext) {
        var R = 6371000; // Radius of the earth in m
        var dLat = deg2rad(locationNext.Latitude-locationPrev.Latitude);
        var dLon = deg2rad(locationNext.Longitude-locationPrev.Longitude); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(locationPrev.Latitude)) * Math.cos(deg2rad(locationNext.Latitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    static equals(location1, location2) {
        return location1.Longitude === location2.Longitude && location1.Latitude === location2.Latitude;
    }

    static convertSpeed(speed) {
        if (speed === 0) {
            return "00:00";
        }
        const secPer500 = Math.round(500 / speed);
    
        const minutes = Math.trunc(secPer500 / 60);
        const seconds = secPer500 % 60;
        return ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2);
    }
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}