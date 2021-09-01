import React from "react";
import { connect } from 'react-redux';
import axios from "axios";
import Factor from "src/reusable/Factor";
import Alert from "src/reusable/Alert";
import store from "src/store";
import * as models  from "../models/models"

class FactorDetails extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            factor : null,
        }
    }

    componentDidMount(){
        let shopID = this.props.match.params.shopID
        let factorNumber = this.props.match.params.factorID

        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      
            let url = `${models.URL}/factor/${factorNumber}/${shopID}`
            
            axios.get(url,config)
           .then(response => response.data)
           .then(data => this.setState({
               factor : data
           }))
           .catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }

                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
               
                return
              }
              this.props.onAlert(true,true,err.response.data.errors[0].detail)
           })

    }

    render(){
        return(
            <>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
            {this.state.factor ? <Factor factor={this.state.factor}/> : null}
            </>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        token : state.user.token,
        accessibility : state.user.accessibility,
        alert : state.alert,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onExit : () => dispatch({ type : store.USER_LOGOUT, user : {
            token : null,
            accessibility : [],
            userName : ""
        }}),
        onAlert : (show,error,message) => dispatch({ type : store.SHOW_ALERT, alert :{
            show,
            error,
            message,
        } })
    } 
}

export default connect(mapStateToProps, mapDispatchToProps)(FactorDetails)