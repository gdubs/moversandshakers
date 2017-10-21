import React from 'react';

class Validation extends React.Component{
    
    componentWillMount(){
        this.setState({ message: this.props.message });
    }
    componentWillReceiveProps(nextProps, prevProps){
        
        if(this.state !== nextProps.route){
            this.setState(nextProps.route)
        }
    }
    render(){
        return(
            <div className="alert alert-danger">{this.state.message}</div>
        );
    }
}

export default Validation;