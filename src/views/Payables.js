import React from 'react'
import {
    CContainer,
    CCol,
    CRow,
} from '@coreui/react'
import * as models from "../models/models"
import Header from "../reusable/header"
import EquitiesTable from 'src/reusable/EquitiesTable'
import axios from 'axios';
import * as store from "../store";
import { connect } from 'react-redux';
import Alert from   "../reusable/Alert";
import Pagination from 'src/reusable/Pagination'



class Payables extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            equities : [],
            shopID : "",
            totalPage : 0,
            currentPage : 1,
            filter : "",
            filteredURL : "",

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
            let url = `${models.URL}/debts/${shopID}?page[size]=10&sort[clear_date]=asc`
            axios.get(url,config)
           .then(response => response.data)
           .then(response => {
               if (response.meta.total === 0) {
                this.setState({
                    equities : [],
                    totalPage : 0,
                    filter : "",
                    filteredURL : url,
                })

                return
               } 
            
               this.setState({
                   equities : response.data,
                   totalPage : response.meta.last_page,
                   currentPage : 1,
                   filter : "",
                   filteredURL : url,
                   shopID,
               })
           }).catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                
                this.setState({
                    equities : [],
                    shopID : "",
                    totalPage : 0,
                    currentPage : 1,
                    filter : "",
                    filteredURL : "",
                })

                return
                }

                this.props.onAlert(true,true,err)
           })
    }

    handleFilter = (filter) => {
            if (this.state.shopID === "") {
                return
            }

            const config = {
                headers: {
                    "Authorization" : `bearer ${this.props.token}`
                },
            };      
                // let url = `${models.URL}/debts/${this.state.shopID}`
                let url = `${models.URL}/debts/${this.state.shopID}?page[size]=10&sort[clear_date]=asc`

                if (filter !== "all") {
                   url = `${models.URL}/debts/${this.state.shopID}?page[size]=10sort[clear_date]=asc&filter[status]=${filter}`
                } else {
                    url = `${models.URL}/debts/${this.state.shopID}?page[size]=10sort[clear_date]=asc`
                }
                
                axios.get(url,config)
               .then(response => response.data)
               .then(response => {
                   if (response.meta.total === 0) {
                    this.setState({
                        equities : [],
                        totalPage : 0,
                        filter, 
                        filteredURL : url
                    })
    
                    return
                   } 
                
                   this.setState({
                       equities : response.data,
                       totalPage : response.meta.last_page,
                       currentPage : 1,
                       filter,
                       filteredURL : url
                   })
               }).catch(err => {
                if (err.response.data.errors !== null) {
                    if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                        this.props.onExit()
                        }
                    
                    this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                    
                    this.setState({
                        equities : [],
                        shopID : "",
                        totalPage : 0,
                        currentPage : 1,
                        filter : "",
                        filteredURL : "",
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

        let url = this.state.filteredURL + `&page[number]=${page}`

        console.log(url)

        axios.get(url,config)
        .then(response => response.data)
        .then(response => {
            this.setState({
                equities : response.data,
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
                 equities : [],
                 shopID : "",
                 totalPage : 0,
                 currentPage : 1,
                 filter : "",
                 filteredURL : "",
             })

             return
             }

             this.props.onAlert(true,true,err)
        })
    }

    handleUpdateEquity = (equity) => {
        this.props.history.push(`/update-payable/${equity.id}`)
    }

    render() {
        let pagination = this.state.totalPage ? (
            <div className="row justify-content-center" xs="12" md="8">
            <Pagination  totalPage={this.state.totalPage} handleChangePage={this.handleChangePage} />
        </div>
        ) : null;
        return (
            <>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
            <CContainer>
                <CRow className="mb-3">
                    <CCol>
                        <Header selects={this.props.accessibility} handleSelect = {this.handleSelect}/>
                    </CCol>
                </CRow>
            </CContainer>
            {this.state.equities ? <EquitiesTable handleUpdate={this.handleUpdateEquity} shopID={this.state.shopID} filter={this.state.filter} handleFilter={this.handleFilter}  {...this.props} equities = {this.state.equities}/> : null}
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
        onExit : () => dispatch({
            //  type : store.USER_LOGOUT, 
             user : {
            token : null,
            accessibility : [],
            userName : ""
        }}),
        onAlert : (show,error,message) => dispatch({ 
            // type : store.SHOW_ALERT, 
            alert :{
            show,
            error,
            message,
        } })
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(Payables)

