import React from 'react';
import RouteProvider from '../../providers/routeProvider.jsx';

class Location extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.generateRoute = this.generateRoute.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount(){
        this.setState({ fromLocation: '', toLocation: '', processing: false });
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
            return { processing: true }
        })
        RouteProvider.getApiToken()
                    .then((response) => {
                        console.log('getting location route' + response.data);

                        let data = {
                            auth: response.data,
                            route: {
                                from: '',
                                to: ''
                            }
                        }
                        return RouteProvider.getRoutes(data);
                    })
                    .then(res => {
                        //console.log(JSON.stringify(res));
                        // for the sake of the challenge, the status will be checked, to see if 
                        // provider will be called again.

                        switch(res.data.status){
                            case 'in progress':
                                console.log('for the sake of the challenge..calling this again');
                                this.generateRoute(e);
                                break;
                            case 'failure':
                                //console.log('handle failure');
                                this.setState(() => {
                                    return { error: { message: 'Failed generating the route. Please try again.'}}
                                })
                                break;
                            case 'success':
                                console.log('apply change of route');
                                this.props.routeChanged(res);
                                break;
                            default:
                                console.log('this state' + JSON.stringify(this.state));
                        }
                        
                    })
                    .catch(err =>{
                        //alert('Message: ' + err);
                        this.setState(() => {
                                console.log('internal server err')
                                return { error: { message: 'We\'re having server issues at the moment. Please try again.'}}
                            })
                    });

                   
    }
    render(){
        return(
            <div>
                <input type="text" value={this.state.fromLocation} name="fromLocation" placeholder="From Where?" className="form-control" onChange={this.handleChange} />
                <input type="text" value={this.state.toLocation} name="toLocation" placeholder="To Where?" className="form-control" onChange={this.handleChange} />
                
                <button type="button" className="btn btn-default preview-add-button" onClick={this.generateRoute}>
                    Get Route
                </button>
            </div>
        );
    }
}

export default Location;