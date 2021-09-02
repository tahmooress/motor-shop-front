import React from 'react'
import {
    CDataTable,
    CCollapse,
    CButton,
    CCardBody,
    CContainer,
    CCol,
    CRow,
} from '@coreui/react'
import * as util from "../utilities/utilites";



  const fields = [
    { key: 'شماره فاکتور'}, ,
    { key: 'تاریخ'},
    { key: 'مبلغ کل'},
    { key: 'پرداخت شده'},
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

  class Factors extends React.Component{
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
            this.props.history.push(`/customers/${customerID}`)
        }

        handleFactorDetail = (factorID) => {
            this.props.history.push(`/factors/${factorID}/${this.props.shopID}`)
        }

      render(){
        let customers = []
        let factors = this.props.factors.map((factor, index) => {
            customers.push(factor.customer_id)
            return  {
                id : index,
                'شماره فاکتور' : factor.factor_number,
                'تاریخ' : new Date(factor.created_at).toLocaleDateString("fa"),
                'مبلغ کل' : util.seprator(factor.total_amount),
                'پرداخت شده' : util.seprator(factor.payed_amount),
            }
        })
        return (
            <>  
               <CDataTable
              items={factors}
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
                'details':
                    (item, index)=>{
                      return (
                      <CCollapse show={this.state.details.includes(index)}>
                        <CCardBody>
                            <CContainer>
                                <div className="row justify-content-center" xs="12" md="8">
                                    <CCol >
                                        <CRow xs="12" md="8">
                                            <CCol xs="6">
                                                <CButton onClick={() => this.handleDetailCustomer(customers[index])} size="sm" color="info" className="btn btn-primary btn-block">
                                                    جزییات مشتری
                                                </CButton>
                                            </CCol>
                                            <CCol xs="6">
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
            </>
          )
      }
  }


export default Factors

