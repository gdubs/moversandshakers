import React from 'react';
import { render } from 'react-dom';
import Map from './components/map/map.jsx';
import RouteProvider from './providers/routeProvider.jsx';
// import Location from './components/location/location.jsx';

import { Link,Route,Switch } from 'react-router-dom';

class App extends React.Component{
    constructor(){
        super();
        this.state = {};
        //this.routeChangedHandler = this.routeChangedHandler.bind(this);
        this.generateRoute = this.generateRoute.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount(){
        this.setState({ fromLocation: '', toLocation: '', processing: false, route: null });
    }
    
    handleChange(e){
        e.persist();
        this.setState((prevState, props)=>{
            return { [e.target.name]: e.target.value };
        })
    }
    
    generateRoute(e){
        e.persist();
              
        this.setState(()=>{
            return { processing: true, error: null, route: null }
        })

        var data = { auth: '' }

        RouteProvider.getApiToken()
                    .then((response) => {
                        console.log('getting location route' + response.data);
                        
                        data.auth = response.data;

                        return RouteProvider.getRoutes(data.auth);
                    })
                    .then(res => {
                        //console.log(JSON.stringify(res));
                        // for the sake of the challenge, the status will be checked, to see if 
                        // provider will be called again.

                        switch(res.data.status){
                            case 'in progress':
                                console.log('for the sake of the challenge..calling this again');
                                RouteProvider.getRoutes(data.auth);
                                break;
                            case 'failure':
                                //console.log('handle failure');
                                this.setState(() => {
                                    return { error: { message: 'Failed generating the route. ' + res.data.error + '. Please try again.'}}
                                })
                                break;
                            case 'success':
                                console.log('apply change of route');
                                var route = {};
                                route.location = { from: this.state.fromLocation, to: this.state.toLocation };
                                route.from = [res.data.path.shift()].map(point => { return {lat: parseFloat(point[0]), lng: parseFloat(point[1])};})[0];
                                route.to = [res.data.path.pop()].map(point => { return {lat: parseFloat(point[0]), lng: parseFloat(point[1])};})[0];
                                route.totalDistance = res.data.total_distance;
                                route.totalTime = res.data.total_time;

                                if(res.data.path.length > 0){
                                    route.waypoints = res.data.path.map(point => {
                                        return {
                                                    location: { lat: parseFloat(point[0]), lng: parseFloat(point[1]) },
                                                    stopover: false
                                                }
                                    })
                                }
                                

                                this.setState(() => {
                                    return { route : route }
                                })
                                break;
                            default:
                                console.log('this state' + JSON.stringify(this.state));
                        }
                        
                        this.setState(() => {
                                    return { processing: false }
                                })
                    })
                    .catch(err =>{
                        this.setState(() => {
                                console.log('internal server err ' + err)
                                return { error: { message: 'We\'re having server issues at the moment. Please try again.'}, processing: false}
                            })
                    });

                   
    }
    render(){
        var formStyle = {
            paddingTop:20,
            paddingBottom:20
        }

        return (
        <div className="container">
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <h2>Get the best route</h2>
                </div>
            </nav>
            <div className="container-fluid">
                <h2>Pick locations</h2>
                {/* <Location routeChanged={this.routeChangedHandler}/> */}
                
                {
                    this.state.error
                    ?
                        <div>
                            {this.state.error.message}
                        </div>
                    :
                        null
                }
                <div className="row" style={formStyle}>
                    <input type="text" value={this.state.fromLocation} name="fromLocation" placeholder="From Where?" className="form-control" onChange={this.handleChange} />
                    <input type="text" value={this.state.toLocation} name="toLocation" placeholder="To Where?" className="form-control" onChange={this.handleChange} />
                    
                    <button type="button" className="btn btn-default preview-add-button" onClick={this.generateRoute}>
                        Get Route
                    </button>
                </div>
                {
                    this.state.processing
                    ? <div>Generating Route...</div>
                    : null
                }
                <Map route={this.state.route}/>
            </div>
        </div>
        );
    }
}



render(<App/>, document.getElementById('app'));