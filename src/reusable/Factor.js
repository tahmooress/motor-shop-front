import React from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CInput,
    CRow,
    CCardTitle,
    CLabel,
    CDataTable,
    CBadge,
  } from '@coreui/react'
  import * as util from "../utilities/utilites";


  const financialFields = ["مبلغ کل", "پرداخت شده", "مانده"]
  const motorFields = ["پلاک", "مدل", "رنگ", "سال تولید", "شماره شاسی"]
  const customerFields =["نام","نام خانوادگی", "موبایل", "کد ملی", "شرکت"]
  const equityFields = ["ردیف","مبلغ", "سررسید", "وضعیت"]

class Factor extends React.Component{
    render(){
      let totalAount = this.props.factor.total_amount ?  util.seprator(this.props.factor.total_amount) : "";
      let payedAmount = this.props.factor.payed_amount ?  util.seprator(this.props.factor.payed_amount) : "";
      let remainAmount = (this.props.factor.total_amount && this.props.factor.payed_amount) ? util.seprator(Number(this.props.factor.total_amount) - Number(this.props.factor.payed_amount)) : "";
      let financeData = [
            {
                id : 0,
                "مبلغ کل": totalAount,
                "پرداخت شده" : payedAmount,
                "مانده" : remainAmount,
            }
        ]
      let motors = this.props.factor.motors ?  this.props.factor.motors.map((motor,index) => {
          return {
                id : index,
                "پلاک" : motor.pelak_number,
                "مدل" : motor.model_name,
                "رنگ" : motor.color,
                "سال تولید" : motor.model_year,
                "شماره شاسی" : motor.body_number,
          }
      }) : [];
      let customer = this.props.factor.customer.name ? [
        { 
          id : 0,
          "نام" : this.props.factor.customer.name,
          "نام خانوادگی" : this.props.factor.customer.last_name,
          "موبایل" : this.props.factor.customer.mobile,
          "کد ملی" : this.props.factor.customer.national_code ? this.props.factor.customer.national_code : null,
          "شرکت" : this.props.factor.customer.company ? this.props.factor.customer.company : null,
        }
      ] : [];

      let equities = this.props.factor.equities.map((equity, index) =>{
        return { 
            "ردیف" : index+1,
            "مبلغ" : util.seprator(equity.amount),
            "سررسید" : new Date(equity.due_date).toLocaleDateString("fa"),
            "وضعیت" : util.getStatus(equity.status)
        }
      })
        return (
            <CCard>
                <CCardHeader>
                    <CRow>
                    <CCol  md="6" xs="6">
                        <CLabel>شماره فاکتور</CLabel>
                        <CInput  type="text" name="factor_number" value={this.props.factor.factor_number}  disabled />
                    </CCol>
                    <CCol  md="6" xs="6">
                        <CLabel>تاریخ صدور</CLabel>
                        <CInput type="text" name="created_at"  value={new Date(this.props.factor.created_at).toLocaleDateString("fa")} disabled />
                    </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody>
                    <CRow className="mt-2">
                        <CCol >
                            <CCardTitle>مشخصات فاکتور</CCardTitle>
                        </CCol>
                      </CRow>
                  <CRow >
                      <CCol xs="12" md="12">
                          <CDataTable
                        items={financeData}
                        fields={financialFields}
                        striped     
                      />
                      </CCol>
                  </CRow>
                  <CRow className="mt-2">
                        <CCol >
                            <CCardTitle>موتورها</CCardTitle>
                        </CCol>
                      </CRow>
                  <CRow >
                      <CCol xs="12" md="12">
                          <CDataTable
                          color="primary"
                        items={motors}
                        fields={motorFields}
                        striped     
                      />
                      </CCol>
                  </CRow>
                  <CRow className="mt-2">
                        <CCol >
                            <CCardTitle>مشتری</CCardTitle>
                        </CCol>
                      </CRow>
                  <CRow >
                      <CCol xs="12" md="12">
                          <CDataTable
                          color="primary"
                        items={customer}
                        fields={customerFields}
                        striped     
                      />
                      </CCol>
                  </CRow>
                  <CRow className="mt-2">
                        <CCol >
                            <CCardTitle>اقساط</CCardTitle>
                        </CCol>
                      </CRow>
                  <CRow >
                      <CCol xs="12" md="12">
                          <CDataTable
                          color="secondary"
                        items={equities}
                        fields={equityFields}
                        striped
                        scopedSlots = {{
                          'وضعیت':
                            (item)=>(
                              <td>
                                <CBadge color={util.getFactorBadge(item["وضعیت"])}>
                                  {item["وضعیت"]}
                                </CBadge>
                              </td>
                            )
          
                        }}
                      />
                      </CCol>
                  </CRow>
                </CCardBody>
            </CCard>
        )
    }
}

export default Factor;