import React from 'react';
import { render } from 'react-dom';
import Map from './components/map/map.jsx';
import RouteProvider from './providers/routeProvider.jsx';
import Validation from './components/validation/validation.jsx';
import Loader from './components/utils/loader.jsx';
// import Location from './components/location/location.jsx';

import { Link,Route,Switch } from 'react-router-dom';

class App extends React.Component{
    constructor(){
        super();
        this.state = {};
        //this.routeChangedHandler = this.routeChangedHandler.bind(this);
        this.generateRoute = this.generateRoute.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getRoutes = this.getRoutes.bind(this);
        this.validInput = this.validInput.bind(this);
    }
    componentWillMount(){
        this.setState({ fromLocation: '', 
                        toLocation:  '', 
                        processing: false, 
                        route: null });
    }
    
    handleChange(e){
        e.persist();
        this.setState((prevState, props)=>{
            return { [e.target.name] : e.target.value };
        })
    }
    validInput(e){
        let valid = false;

        valid = (!this.state.fromLocation || !this.state.toLocation) ? false : true;

        return valid;
    }
    generateRoute(e){
        e.persist();

        this.setState(()=>{
            return { processing: true, error: null, route: null }
        })

        if(!this.validInput(e)){
            this.setState(()=>{
                return { processing: false, error : { message: 'Please enter from and to Location.'}}
            })
            return;
        }

        var data = { auth: '' }

        RouteProvider.getApiToken()
                    .then((response) => {
                        console.log('getting location route' + response.data);
                        
                        data.auth = response.data;

                        return this.getRoutes(data);
                    })
                    .catch(err =>{
                        this.setState(() => {
                                console.log('internal server err ' + err)
                                return { error: { message: 'We\'re having server issues at the moment. Please try again.'}, processing: false}
                            })
                    });

                   
    }
    getRoutes(data){
        RouteProvider.getRoutes(data.auth)
                    .then((res) => {
                        //console.log(JSON.stringify(res));
                        // for the sake of the challenge, the status will be checked, to see if 
                        // provider will be called again.

                        switch(res.data.status){
                            /*case 'in progress':
                                console.log('for the sake of the challenge..calling this again');
                                return generateRoute();
                                break;*/
                            case 'failure':
                                //console.log('handle failure');
                                this.setState(() => {
                                    return { error: { message: 'Failed generating the route. ' + res.data.error + '. Please try again.'}, processing: false, route:null}
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
                                    return { route : route, processing: false }
                                })
                                break;
                            default:
                                this.getRoutes(data);
                        }
                        
                    }).catch(err =>{
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
                        <div className="row">
                            <Validation message={this.state.error.message}/>
                        </div>
                    :
                        null
                }
                <div className="row" style={formStyle}>
                    <div className="input-padding">
                        <input type="text" value={this.state.fromLocation} name="fromLocation" placeholder="From Where?" className={"form-control " + (!this.state.fromLocation ? 'invalid' : '')} onChange={this.handleChange} />
                    </div>
                    <div className="input-padding">
                        <input type="text" value={this.state.toLocation} name="toLocation" placeholder="To Where?" className={"form-control " + (!this.state.toLocation ? 'invalid' : '')} onChange={this.handleChange} />
                    </div>
                    <button type="button" className="btn btn-default preview-add-button" onClick={this.generateRoute}>
                        Get Route
                    </button>
                </div>
                {
                    this.state.processing
                    ? <Loader />
                    : null
                }
                <Map route={this.state.route}/>
            </div>
        </div>
        );
    }
}



render(<App/>, document.getElementById('app'));