import React from "react";
import {CCard, CCardBody, CRow,CCol, CFormGroup,CInput} from '@coreui/react';
import * as models from "../models/models"

class CustomerResult extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            id : this.props.customer.id,
            name : "",
            last_name : "",
            mobile : "",
            national_code : "",
            company : "",
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleAddCustomer = () => {
        let notValid = this.state.name === "" || this.state.last_name === ""  || this.state.mobile === ""
       
        if(this.props.customer.id === null && notValid){
            return
        }

        if(!notValid){
            let customer = new models.Customer(this.state.id,this.state.name, this.state.last_name, this.state.mobile, this.state.national_code, this.state.company)
            this.props.handleAddCustomer(customer)
            this.props.handleClose()

            return
        }

        let customer = new models.Customer(this.props.customer.id,this.props.customer.name, this.props.customer.last_name, this.props.customer.mobile, this.props.customer.national_code, this.props.customer.company)
        this.props.handleAddCustomer(customer)
        this.props.handleClose()
        console.log(customer)
    }

    render(){
        console.log(this.props, "customer result")
        return(
            <React.Fragment>
                <CCard>
                    <CCardBody>
                    <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="name" placeholder="نام" required onChange={this.handleChange} value={this.props.customer.name || this.state.name}/>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="last_name" placeholder="نام خانوادگی" required onChange={this.handleChange} value={this.props.customer.last_name || this.state.last_name} />
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="mobile" placeholder="موبایل" required  onChange={this.handleChange} value={this.props.customer.mobile || this.state.mobile}/>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="national_code" placeholder="کد ملی" required onChange={this.handleChange}  value={this.props.customer.national_code || this.state.national_code}/>
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="company" placeholder="شرکت" required onChange={this.handleChange} value={this.props.customer.company || this.state.company}/>
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput onClick={()=>this.handleAddCustomer()} type ="button" className="btn btn-primary border border-primary"  name="submit" value="افزودن" required />
                        </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput onClick={()=>this.props.handleClose()} type="button"  className="btn btn-danger btn-pill border border-danger" name="cancel" value="انصراف" required />
                        </CFormGroup>
                    </CCol>
                </CRow>
                    </CCardBody>
                </CCard>
            </React.Fragment>
        )
    }
}

export default CustomerResult;