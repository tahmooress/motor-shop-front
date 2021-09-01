import React from "react";
import {CCard, CCardBody, CRow,CCol, CFormGroup,CInput} from '@coreui/react';
import * as models from "../models/models"

class MotorResult extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            id : this.props.motor.id,
            pelak_number : "",
            body_number : "",
            model_name :"",
            model_year : "",
            color : ""
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleAddMotor = () => {
        let notValid = this.state.pelak_number === "" || this.state.body_number=== ""  || this.state.color=== ""  || this.state.model_name=== ""  || this.state.model_year=== "" 
        if(this.props.motor.id === null && notValid){
            return
        }
        
        if (!notValid) {
            let motor = new models.Motor(this.state.id,this.state.pelak_number, this.state.body_number, this.state.color, this.state.model_name, this.state.model_year)
            this.props.handleAddMotor(motor)
            this.props.handleClose()

            return
        }



        let motor = new models.Motor(this.props.motor.id,this.props.motor.pelak_number, this.props.motor.body_number, this.props.motor.color, this.props.motor.model_name, this.props.motor.model_year)
        this.props.handleAddMotor(motor)
        this.props.handleClose()
    }

    render(){
        return(
            <React.Fragment>
                <CCard>
                    <CCardBody>
                    <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="pelak_number" placeholder="شماره پلاک" required onChange={this.handleChange} value={this.props.motor.pelak_number || this.state.pelak_number}/>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="body_number" placeholder="شماره شاسی" required onChange={this.handleChange} value={this.props.motor.body_number || this.state.body_number} />
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="model_name" placeholder="مدل" required  onChange={this.handleChange} value={this.props.motor.model_name || this.state.model_name}/>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="model_year" placeholder="سال تولید" required onChange={this.handleChange}  value={this.props.motor.model_year || this.state.model_year}/>
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput name="color" placeholder="رنگ" required onChange={this.handleChange} value={this.props.motor.color || this.state.color}/>
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" md="6">
                        <CFormGroup>
                            <CInput onClick={()=>this.handleAddMotor()} type ="button" className="btn btn-primary border border-primary"  name="submit" value="افزودن" required />
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

export default MotorResult;