import React from 'react'
import {
    CDataTable,
    CCollapse,
    CBadge,
    CButton,
    CCardBody,
    CContainer,
    CCol,
    CRow,
} from '@coreui/react'
import * as util from "../utilities/utilites";



  const fields = [
    { key: 'شماره فاکتور', _style: { width: '20%'} },
    { key: 'تاریخ سررسید', _style: { width: '20%'} },
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

  class EquitiesTable extends React.Component{
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
       let sourceEquities = []
        let data = this.props.equities.map((equity, index) => {
            sourceEquities.push(equity)
            return  {
                id : index,
                'شماره فاکتور' : equity.factor_number,
                'تاریخ سررسید' : new Date(equity.clear_date).toLocaleDateString("fa"),
                'مبلغ' : util.seprator(equity.amount),
                'وضعیت' : util.getStatus(equity.status)
            }
        })
        return (
            <>  
                <CContainer className="mb-3 mt-3">
                    <div className="row justify-content-center" xs="8" md="6"> 
                        <CCol xs="4" md="4" lg="2">
                            <div className="form-check">
                                <input onChange={(e) => this.props.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={this.props.filter === "debtor"} name="debtor" />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                   بدهکار
                                </label>
                            </div>
                        </CCol >
                        <CCol xs="4" md="4" lg="2">  
                            <div className="form-check">
                                <input onChange={(e) => this.props.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={this.props.filter === "deferred"} name="deferred" />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    معوق
                                </label>
                            </div>
                        </CCol>
                        <CCol xs="4" md="4" lg="2">  
                            <div className="form-check">
                                <input onChange={(e) => this.props.handleFilter(e.target.name)} className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={this.props.filter === "all"} name="all" />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    بدون فیلتر
                                </label>
                            </div>
                        </CCol>
                    </div>
                </CContainer>
               <CDataTable
              items={data}
              fields={fields}
              scopedSlots = {{
                'وضعیت':
                  (item)=>(
                    <td>
                      <CBadge color={util.getFactorBadge(item["وضعیت"])}>
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
                                                <CButton onClick={() => this.handleDetailCustomer(sourceEquities[index].customer_id )} size="sm" color="info" className="btn btn-primary btn-block">
                                                    جزییات مشتری
                                                </CButton>
                                            </CCol>
                                            <CCol xs="4">
                                                <CButton onClick={() => this.props.handleUpdate(sourceEquities[index])} size="sm" color="info" className="btn btn-primary btn-block">
                                                    بروز رسانی
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
            </>
          )
      }
  }


export default EquitiesTable

