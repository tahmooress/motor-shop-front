import React from "react";
import { connect } from 'react-redux';
import axios from "axios";
import store from "src/store";
import * as models  from "../models/models"
import {CContainer, CDataTable} from "@coreui/react";
import Pagination from "src/reusable/Pagination";



const fields = [
    { key: 'نام', _style: { width: '20%'} },
    { key: 'نام خانوادگی', _style: { width: '20%'} },
    { key: 'موبایل', _style: { width: '20%'} },
    { key: 'کد ملی', _style: { width: '20%'} },
    { key: 'شرکت', _style: { width: '20%'} },
  ]


class Customers extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            customers : [],
            currentPage : 1,
            totalPage : 0
        }
    }
    componentDidMount(){
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        }; 

        let url = `${models.URL}/customers?page[size]=10&page[number]=${1}&sort[created_at]=desc`

        axios.get(url,config)
        .then(response => response.data)
        .then(response => {
            this.setState({
                customers : response.data,
                totalPage : response.meta.last_page,
                currentPage : 1,
            })
        }).catch(err => {
        if (err.response.data.errors !== null) {
            if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                this.props.onExit()
                }
            
            this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
            
            this.setState({
                customers : [],
                totalPage : 0,
                currentPage : 1,
            })

            return
            }

            this.props.onAlert(true,true,err)
        })
    }

    handleChangePage = (page) => {
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        }; 

        let url = `${models.URL}/customers?page[size]=10&page[number]=${page}&sort[created_at]=desc`

        axios.get(url,config)
        .then(response => response.data)
        .then(response => {
            this.setState({
                customers : response.data,
                totalPage : response.meta.last_page,
                currentPage : page,
            })
        }).catch(err => {
         if (err.response.data.errors !== null) {
             if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                 this.props.onExit()
                 }
             
             this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
             
             this.setState({
                 customers : [],
                 totalPage : 0,
                 currentPage : 1,
             })

             return
             }

             this.props.onAlert(true,true,err)
        })
    }

    render(){
        let customers = this.state.customers ? this.state.customers.map((customer,index) => {
            return {
                    id : index,
                    "نام" :customer.name,
                    "نام خانوادگی" : customer.last_name,
                    "موبایل" : customer.mobile,
                    "کد ملی" : customer.national_code ? customer.national_code : null,
                    "شرکت" : customer.company ? customer.company : null, 
            }
        }) : [];
        let pagination = this.state.totalPage ? (
            <div className="row justify-content-center" xs="12" md="8">
            <Pagination  totalPage={this.state.totalPage} handleChangePage={this.handleChangePage} />
        </div>
        ) : null;
        return (
            <>
                <CContainer>
                    <CDataTable
                        items={customers}
                        fields={fields}
                        />
                </CContainer>
                {pagination}
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

export default connect(mapStateToProps, mapDispatchToProps)(Customers)