import React from 'react';

class Map extends React.Component{
    constructor(){
        super();
        this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);
        this.initMap = this.initMap.bind(this);
        this.resetMap = this.resetMap.bind(this);
        this.directionsDisplay = null;
        this.directionsService = null;
        this.map = null;
    }
    componentWillMount(){
        this.setState(this.props.route)
    }
    componentWillReceiveProps(nextProps, prevProps){
        
        if(this.state !== nextProps.route){
            this.setState(nextProps.route)
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        var shouldUpdate = (!nextProps.route) ? false : true;
        return shouldUpdate;
    }
    componentDidUpdate(prevProps, prevState){
        console.log('componentdidupdate')
        if(prevProps.route)
            this.initMap();
        else
            this.resetMap();
    }
    componentDidMount(){
        // assigns the functions to the window scope variables
        // then loads the google scripts after the component has been loaded 
        window.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);
        window.initMap = this.initMap.bind(this);
        loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBBq4G8hoMVe8QDoXIquBkPMJZ84mzSQ8E&callback=initMap')
    }
    resetMap(){
        this.directionsDisplay.setMap(null);
    }
    initMap(){
            this.directionsDisplay = (this.directionsDisplay) || new google.maps.DirectionsRenderer;
            this.directionsService = (this.directionsService) || new google.maps.DirectionsService;
            this.map = (this.map) || new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: {lat: 22.372081, lng: 114.107877}
            });
            this.directionsDisplay.setMap(this.map);

            if(this.state)
                calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
            else
                this.directionsDisplay.setMap(null);
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var selectedMode = 'DRIVING';
            var waypoints = []
            
            directionsService.route({
                origin: this.state.from,
                destination: this.state.to,
                waypoints: this.state.waypoints,
                optimizeWaypoints: true, 
                travelMode: google.maps.TravelMode[selectedMode]
                }, function(response, status) {
                    if (status == 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
        }
    render(){
        return(
            <div className="row">
                <h2>Map</h2>
                <div id="map"></div>
                {
                    this.state
                    ?   <div id="right-panel">
                            <div className="panel panel-success">
                                <div className="panel-heading">Your route</div>
                                <div className="panel-body">
                                    <div>From : {this.state.location.from}</div>
                                    <div>To : {this.state.location.to}</div>
                                    <div>Total Distance : {this.state.totalDistance}</div>
                                    <div>Total Time : {this.state.totalTime}</div>
                                </div>
                            </div>
                        </div>
                    : null
                }
            </div>
        );
    }
}

function loadScript(src) {
    // script loading function ..
    // makes sure that the google script is loaded only after the component has mounted 
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

export default Map;