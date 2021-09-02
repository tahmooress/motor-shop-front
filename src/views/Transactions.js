import React from 'react'
import {
    CDataTable,
    CCollapse,
    CContainer,
    CCardBody,
    CRow,
    CCol,
    CButton,
    CBadge,
} from '@coreui/react'
import * as models from "../models/models"
import axios from 'axios';
import {userLogout, showAlert} from "../store";
import { connect } from 'react-redux';
import Pagination from 'src/reusable/Pagination';
import * as util from '../utilities/utilites';
import Alert from 'src/reusable/Alert';
import CIcon from '@coreui/icons-react'
import Header from 'src/reusable/header';



const fields = [
    { key: 'مبلغ', _style: { width: '20%'} },
    { key: 'تاریخ', _style: { width: '20%'} },
    { key: 'نوع تراکنش', _style: { width: '20%'} },
    { key: 'دلیل تراکنش', _style: { width: '20%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

class Transactions extends React.Component{
    constructor(props){
        super(props)
        this.state = {  
            shopID : "",
            totalPage : 0,
            currentPage : 1,
            details : [],
            filteredURL : "",
            transactions : [],
            filter : ""
        }
    }

    handleSelect = (shopID) => {
        if(shopID === "") {
            return
        }

        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      

         let url = `${models.URL}/transactions/${shopID}?page[size]=10&sort[created_at]=desc`
         axios.get(url,config)
         .then(response => response.data)
         .then(response => {
             if (response.meta.total === 0){
                this.setState({
                    transactions : [],
                    totalPage : 0,
                    filter : "",
                    filteredURL : url,
                    shopID
                })

                return
             }
             this.setState({
                transactions : response.data,
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
                    return
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                
                this.setState({
                    transactions : [],
                    shopID : "",
                    totalPage : 0,
                    currentPage : 1,
                    filter : "",
                    filteredURL : "",
                })

                return
                }

                this.props.onAlert(true,true,"خطایی در سیستم رخ داده")

                this.setState({
                    transactions : [],
                    shopID : "",
                    totalPage : 0,
                    currentPage : 1,
                    filter : "",
                    filteredURL : "",
                })
         })
     
    }

    toggleDetails = (index) => {
        const position = this.state.details.indexOf(index)
        let newDetails = this.state.details.slice()
        if (position !== -1) {
        newDetails.splice(position, 1)
        } else {
        newDetails = [...this.state.details, index]
        }
        
        this.setState({
            details : newDetails
        })
    }

    handleChangePage = (page) => {
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        }; 

        let url = this.state.filteredURL + `&page[number]=${page}`

        axios.get(url,config)
        .then(response => response.data)
        .then(response => {
            this.setState({
                transactions : response.data,
                totalPage : response.meta.last_page,
                currentPage : page,
            })
        }).catch(err => {
         if (err.response.data.errors !== null) {
             if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                 this.props.onExit()
                 return
                 }
             
             this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
             
             this.setState({
                 transactions : [],
                 shopID : "",
                 totalPage : 0,
                 currentPage : 1,
                 filter : "",
                 filteredURL : "",
             })

             return
             }

             this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
             this.setState({
                transactions : [],
                shopID : "",
                totalPage : 0,
                currentPage : 1,
                filter : "",
                filteredURL : "",
            })
        })
    }

    handleCreateTX = () => {
        this.props.history.push("/create-tx")
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
            let url = `${models.URL}/transactions/${this.state.shopID}?page[size]=10&sort[created_at]=desc`

            if (filter !== "all") {
               url = `${models.URL}/transactions/${this.state.shopID}?page[size]=10&sort[created_at]=desc&filter[type]=${filter}`
            } else {
                url = `${models.URL}/transactions/${this.state.shopID}?page[size]=10&sort[created_at]=desc`
            }
            
            axios.get(url,config)
           .then(response => response.data)
           .then(response => {
               if (response.meta.total === 0) {
                this.setState({
                    transactions : [],
                    totalPage : 0,
                    filter, 
                    filteredURL : url
                })

                return
               } 
            
               this.setState({
                   transactions : response.data,
                   totalPage : response.meta.last_page,
                   currentPage : 1,
                   filter,
                   filteredURL : url
               })
           }).catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    return
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                
                this.setState({
                    transactions : [],
                    shopID : "",
                    totalPage : 0,
                    currentPage : 1,
                    filter : "",
                    filteredURL : "",
                })

                return
                }

                this.props.onAlert(true,true,"خطایی در سیستم رخ داده")

                this.setState({
                    transactions : [],
                    shopID : "",
                    totalPage : 0,
                    currentPage : 1,
                    filter : "",
                    filteredURL : "",
                })
           })
    }

  render(){
    const sourceTxs = []
    let txs = this.state.transactions.length > 0 ? this.state.transactions.map((tx,index) => {
            sourceTxs.push(tx)
            return{
                "مبلغ" : util.seprator(tx.amount),
                "تاریخ" : new Date(tx.created_at).toLocaleDateString("fa"),
                "نوع تراکنش": util.txStatus(tx.type),
                "دلیل تراکنش" : util.txStatus(tx.subject)
            }
    }) : [];
    let pagination = this.state.totalPage ? (
        <div className="row justify-content-center" xs="12" md="8">
        <Pagination  totalPage={this.state.totalPage} handleChangePage={this.handleChangePage} />
    </div>
    ) : null;
      return(
            <> 
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
            <CContainer>
            <CRow className="row justify-content-start mb-3">
                      <CButton onClick={()=>this.handleCreateTX()} ><CIcon className="mx-2" name="cil-credit-card"/>ایجاد تراکنش جدید</CButton>
              </CRow>
                <CRow className="mb-3">
                    <CCol>
                        <Header selects={this.props.accessibility} handleSelect = {this.handleSelect}/>
                    </CCol>
                </CRow>
            </CContainer>
            <CContainer className="mb-3 mt-3">
                    <div className="row justify-content-center" xs="8" md="6"> 
                        <CCol xs="4" md="4" lg="2">
                            <div className="form-check">
                                <input onChange={(e) => this.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="RECEIVED" id="flexCheckDefault" checked={this.state.filter === "RECEIVED"} name="RECEIVED" />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                   دریافت
                                </label>
                            </div>
                        </CCol >
                        <CCol xs="4" md="4" lg="2">  
                            <div className="form-check">
                                <input onChange={(e) => this.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="PAYED" id="flexCheckChecked" checked={this.state.filter === "PAYED"} name="PAYED" />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    پرداخت
                                </label>
                            </div>
                        </CCol>
                        <CCol xs="4" md="4" lg="2">  
                            <div className="form-check">
                                <input onChange={(e) => this.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="all" id="flexCheckChecked" checked={this.state.filter === "all"} name="all" />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    بدون فیلتر
                                </label>
                            </div>
                        </CCol>
                    </div>
                </CContainer>
              <CDataTable
              items={txs}
              fields={fields}
              scopedSlots = {{
                'show_details':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{this.toggleDetails(index)}}
                        >
                          {this.state.details.includes(index) ? 'بستن' : 'جزییات'}
                        </CButton>
                      </td>
                      )
                  },
                  'نوع تراکنش':
                  (item)=>(
                    <td>
                      <CBadge color={util.txStatusStyle(item["نوع تراکنش"])}>
                        {item["نوع تراکنش"]}
                      </CBadge>
                    </td>
                  ),
                'details':
                    (item, index)=>{
                      return (
                      <CCollapse show={this.state.details.includes(index)}>
                        <CCardBody>
                            <CContainer>
                            </CContainer>
                        </CCardBody>
                      </CCollapse>
                    )
                  }
              }}
            />
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
        onAlert : (show,error,message) => dispatch({
            type : showAlert, payload : {
                show : show,
                error : error,
                message : message
            }
        })
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(Transactions)