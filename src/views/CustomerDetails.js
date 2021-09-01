import React from "react";
import { connect } from 'react-redux';
import axios from "axios";
import Alert from "src/reusable/Alert";
import store from "src/store";
import * as models  from "../models/models"
import {CDataTable} from "@coreui/react";

const fields = [
    { key: 'نام', _style: { width: '20%'} },
    { key: 'نام خانوادگی', _style: { width: '20%'} },
    { key: 'موبایل', _style: { width: '20%'} },
    { key: 'کد ملی', _style: { width: '20%'} },
    { key: 'شرکت', _style: { width: '20%'} },
  ]


const Customer = (props) => {

    let customer = props.customer.name ? [
        { 
          id : 0,
          "نام" : props.customer.name,
          "نام خانوادگی" : props.customer.last_name,
          "موبایل" : props.customer.mobile,
          "کد ملی" : props.customer.national_code ? props.customer.national_code : null,
          "شرکت" : props.customer.company ? props.customer.company : null,
        }
      ] : [];

    return (
        <>
        <CDataTable
              items={customer}
              fields={fields}
            />
        </>
    )
}


class CustomerDetails extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            customer : null,
        }
    }

    componentDidMount(){
        let id = this.props.match.params.id
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      
            let url = `${models.URL}/customers?filter[id]=${id}`

            axios.get(url,config)
           .then(response => response.data)
           .then(response => {
               if (response.meta.total === 0){

                this.props.onAlert(true, true,models.NOT_FOUND)
               } else {
                this.setState({
                    customer : response.data[0]
                })
               }
           })
           .catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                    }
                

                return
              }
              this.props.onAlert(true,true,err)
           })

    }

    render(){
        return(
            <>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
            {this.state.customer ? <Customer customer={this.state.customer}/> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails)