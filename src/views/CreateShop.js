import React from 'react'
import {
    CCard,
    CCardHeader,
    CInput,
    CFormGroup,
    CContainer,
    CCardBody,
    CCol,
    CButton
} from '@coreui/react'
import * as models from "../models/models"
import axios from 'axios';
import {showAlert, userLogout} from "../store";
import { connect } from 'react-redux';
import Alert from 'src/reusable/Alert';


class CreateShop extends React.Component{
    constructor(props){
        super(props)
        this.state = {
                shop_name : ""
        }
    }

    handleChange = (e) => {
        this.setState({
           shop_name : e.target.value
        })
    }

    handleSubmit = ()=>{
        if (this.state.shop_name === "") {
            return
        }
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };    
            const body = {
                shop_name : this.state.shop_name
            }

            axios.post(`${models.URL}/shops`, JSON.stringify(body), config)
            .then(response => {
                this.props.onAlert(true,false,"با موفقیت ثبت شد")
            }).catch(err =>{
                this.props.onAlert(true,true,err.message)
            })
    }

    render(){
        return (
            <> 
            <CContainer>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
                <CCard >
                    <CCardHeader>
                        <CButton >ایجاد  فروشگاه جدید</CButton>
                    </CCardHeader>
                    <CCardBody>
                        <div className="row justify-content-center" xs="12" md="8">
                        <CCol xs="12" md="6" className="mb-2">
                                <CInput name="shop_name" placeholder="نام فروشگاه" type="text" onChange={(e) => this.handleChange(e)}/>
                            </CCol>
                        </div>
                        <div className="row justify-content-center" xs="12" md="8">
                            <CCol xs="12" md="6" className="ms-auto">
                                 <CFormGroup>
                                    <CInput onClick={()=>this.handleSubmit()} type="button"  className="btn btn-primary btn-pill border border-primary" name="submit" value="ثبت" required />
                                </CFormGroup>
                          </CCol>
                        </div>
                    </CCardBody>
                </CCard>
            </CContainer>    
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
        onExit : () => dispatch({ type :userLogout, user : {
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateShop)