import React from 'react'
import {
    CDataTable,
    CCollapse,
    CBadge,
    CButton,
    CCardBody,
    CContainer,
    CCol,
    CRow
} from '@coreui/react'
import * as util from "../../../utilities/utilites"
import * as models from "../../../models/models"
import Header from 'src/reusable/header'
import axios from 'axios';
import * as store from "../../../store";
import { connect } from 'react-redux';
import Alert from   "../../../reusable/Alert";

class Tables extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            equities : [],
            shopID : ""
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
    
            axios.get(`${models.URL}/debts/${shopID}`,config)
           .then(response => response.data)
           .then(response => {
               if (response.meta.total === 0) {
                this.setState({
                    equities : []
                })

                return
               } 
            
               this.setState({
                   equities : response.data
               })
           }).catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])

                return
                }

                this.props.onAlert(true,true,err)
           })
    }

    render() {
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
            {this.state.equities ? <EquitiesTables {...this.props} equities = {this.state.equities}/> : null}
            </>
        )
    }
}





  const fields = [
    { key: 'شماره فاکتور', _style: { width: '20%'} },
    { key: 'تاریخ صدور', _style: { width: '20%'} },
    { key: 'مبلغ', _style: { width: '20%'} },
    { key: 'وضعیت', _style: { width: '20%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

  class EquitiesTables extends React.Component{
      constructor(props){
          super(props)
          this.state = {
              details : []
          }
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
        
        handleDetailCustomer = (customerID) => {
            this.props.history.push(`/users/${customerID}`)
        }

        handleFactorDetail = (factorID) => {
            this.props.history.push(`/users/${factorID}`)
        }

      render(){
       let customers = []
        let data = this.props.equities.map((equity, index) => {
            customers.push(equity.customer_id)
            return  {
                id : index,
                'شماره فاکتور' : equity.factor_number,
                'تاریخ صدور' : new Date(equity.created_at).toLocaleDateString("fa"),
                'مبلغ' : util.seprator(equity.amount),
                'وضعیت' : util.getStatus(equity.status)
            }
        })
        return (
            <CDataTable
              items={data}
              fields={fields}
              scopedSlots = {{
                'وضعیت':
                  (item)=>(
                    <td>
                      <CBadge color={util.getBadge(item.status)}>
                        {item["وضعیت"]}
                      </CBadge>
                    </td>
                  ),
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
                'details':
                    (item, index)=>{
                      return (
                      <CCollapse show={this.state.details.includes(index)}>
                        <CCardBody>
                            <CContainer>
                                <div className="row justify-content-md-center" xs="12" md="8">
                                    <CCol >
                                        <CRow xs="12" md="8">
                                            <CCol xs="4">
                                                <CButton onClick={() => this.handleDetailCustomer(customers[index])} size="sm" color="info" className="btn btn-primary btn-block">
                                                    جزییات مشتری
                                                </CButton>
                                            </CCol>
                                            <CCol xs="4">
                                                <CButton onClick={() => this.props.handleUpdate(item["شماره فاکتور"])} size="sm" color="info" className="btn btn-primary btn-block">
                                                    تسویه
                                                </CButton>
                                            </CCol>
                                            <CCol xs="4">
                                                <CButton onClick={() => this.handleFactorDetail(item["شماره فاکتور"])} size="sm" color="info" className="btn btn-primary btn-block">
                                                    جزییات فاکتور
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </div>
                            </CContainer>
                        </CCardBody>
                      </CCollapse>
                    )
                  }
              }}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(Tables)

