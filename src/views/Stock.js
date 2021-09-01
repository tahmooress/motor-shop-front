import React from 'react'
import {
    CContainer,
    CCol,
    CRow,
} from '@coreui/react'
import * as models from "../models/models"
import Header from "../reusable/header"
import InventoryTable from "../reusable/InventoryTable";
import axios from 'axios';
import {showAlert, userLogin, userLogout} from "../store";
import { connect } from 'react-redux';
import Alert from   "../reusable/Alert";
import Pagination from 'src/reusable/Pagination'




class Stock extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            stocks : [],
            shopID : "",
            totalPage : 0,
            currentPage : 1,

        }
    }

    handleSelect = (shopID) => {
        if (shopID === "") {
            return
        }   

        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      
            let url = `${models.URL}/inventory/${shopID}?page[size]=10&sort[created_at]=asc`
            axios.get(url,config)
           .then(response => response.data)
           .then(response => {
               if (response.meta.total === 0) {
                this.setState({
                    stocks : [],
                    totalPage : 0,
                })

                return
               } 
            
               this.setState({
                   stocks : response.data,
                   totalPage : response.meta.last_page,
                   currentPage : 1,
                   shopID,
               })
           }).catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                
                this.setState({
                    stocks : [],
                    shopID : "",
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

        let url = `${models.URL}/inventory/${this.state.shopID}?page[size]=10&page[number]=${page}&sort[created_at]=asc`

        axios.get(url,config)
        .then(response => response.data)
        .then(response => {
            this.setState({
                stocks : response.data,
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
                 stocks : [],
                 shopID : "",
                 totalPage : 0,
                 currentPage : 1,
             })

             return
             }

             this.props.onAlert(true,true,err)
        })
    }


    render(){
        let pagination = this.state.totalPage ? (
            <div className="row justify-content-center" xs="12" md="8">
            <Pagination  totalPage={this.state.totalPage} handleChangePage={this.handleChangePage} />
        </div>
        ) : null;
        return(
            <>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
            <CContainer>
                <CRow className="mb-3">
                    <CCol>
                        <Header selects={this.props.accessibility} handleSelect = {this.handleSelect}/>
                    </CCol>
                </CRow>
            </CContainer>
            {this.state.stocks ? <InventoryTable {...this.props} stocks = {this.state.stocks}/> : null}
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
        onExit : () => dispatch({ type : userLogout, user : {
            token : null,
            accessibility : [],
            userName : ""
        }}),
        onAlert : (show,error,message) => dispatch({ type : showAlert, alert :{
            show,
            error,
            message,
        } })
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(Stock)