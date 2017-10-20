import axios from 'axios';

const root = 'http://localhost:8080';
class routeProvider {
        
    static getApiToken(){
        return axios.post(root + '/route')
                // .then(res => {
                //     return res;
                // })
                // .catch(err => {
                //     let message = err.message + '. Please try again.';

                //     return message;
                // })
    }

    static getRoutes(data){
        return axios.get(root + '/route/' + data.token)
                    // .then(res=> {
                    //     return res;
                    // })
                    // .catch(err => {
                    //     let message = err.message + '. Please try again.';

                    //     return message;
                    // })
    }

    // static getGoogleRoute(){
    //     let googleApiToken = '-';
    //     let request = {
    //         origin: 'Chicago, IL',
    //         destination: 'Los Angeles, CA',
    //         waypoints: [
    //             {
    //             location: 'Joplin, MO',
    //             stopover: false
    //             },{
    //             location: 'Oklahoma City, OK',
    //             stopover: true
    //             }],
    //         provideRouteAlternatives: false,
    //         travelMode: 'DRIVING',
    //         drivingOptions: {
    //             departureTime: new Date(/* now, or future date */),
    //             trafficModel: 'pessimistic'
    //         },
    //         unitSystem: google.maps.UnitSystem.IMPERIAL
    //         }


    // }
}

export default routeProvider;