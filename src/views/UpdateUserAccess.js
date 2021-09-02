import React from 'react'
import {
    CFormGroup,
    CContainer,
    CCardBody,
    CRow,
    CCol,
    CButton,
    CCard,
    CCardHeader,
    CInput,
    CCardFooter,
    CLabel
} from '@coreui/react'
import * as models from "../models/models"
import axios from 'axios';
import { userLogout, showAlert} from "../store";
import { connect } from 'react-redux';
import * as util from '../utilities/utilites';
import Alert from 'src/reusable/Alert';
import CIcon from '@coreui/icons-react'


class UpdateUserAccess extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user_name : "",
            password : "",
            accessibility : [],
            shops : []
        }
    }

componentDidMount(){
    const config = {
        headers: {
            "Authorization" : `bearer ${this.props.token}`
        },
    };      

    axios.get(`${models.URL}/admin`,config)
    .then(response => response.data)
    .then(response => {
        if (response.meta.total === 0 ){
            return
        }
        
        let accesses = []

        try {
            accesses = util.getUserShops(response.data, this.props.userName)
        } catch (error) {
            this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
        }

        this.setState({
            shops : accesses
        })
    }).catch(err => {
        if (err.response.data.errors !== null) {
            if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN || err.response.data.errors[0].detail === "Token is expired") {
                this.props.onExit()

                return
                } 
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                this.setState({
                    user_name : "",
                    password : "",
                    accessibility : [],
                    shops : []
                })

                return
            }

            this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
            this.setState({
                user_name : "",
                password : "",
                accessibility : [],
                shops : []
            })
    })
}

    handleSelect = (e) =>{

        if (this.state.accessibility.indexOf(e.target.value) !== -1) {
            let newAccessibility = util.deleteAccess(this.state.accessibility, e.target.value)
            this.setState({
                accessibility : newAccessibility
            })
        } else{
                this.setState({
                    accessibility : [...this.state.accessibility, e.target.value]
                })
        }

    }

    handleSubmit = () => {
        if(this.state.user_name === "" || this.state.password === "" || this.state.accessibility.length === 0){
            return
        }
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      

        const body = {
            user_name : this.state.user_name,
            password : this.state.password,
            shops : this.state.accessibility.map(shopID => {
                return {
                    id : shopID
                }
            })
        }

         axios.post(`${models.URL}/admin`,JSON.stringify(body),config)
        .then(response =>{
            this.setState({
                user_name : "",
                password : "",
                accessibility : [],
            })   
            this.props.onAlert(true,false,"با موفقیت ثبت شد")      
  
        })
        .catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    return
                    }
                
                this.setState({
                        user_name : "",
                        password : "",
                        accessibility : [],
                })
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])

                return
                }
                
                this.setState({
                    user_name : "",
                    password : "",
                    accessibility : [],
                })
                this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
             
        })

        
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

  render(){
      const shops = this.state.shops ? this.state.shops.map((shop, index)=> {
            return(
                <div className="col-sm-6 col-md-4 form-check" key={index} >
                <input  onChange={(e) =>this.handleSelect(e)} className="form-check-input" type="checkbox" value={shop.id} id="flexCheckDefault"  defaultChecked={false}/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    {shop.shop_name}
                </label>
                </div>
            )
      }) : null;
      return(
            <> 
            <CContainer>
            <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
                <CCard>
                    <CCardHeader>
                        <CButton className="mx-2"><CIcon className="mx-2" name="cil-people"/>ایجاد کاربر جدید</CButton>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="mb-3">
                            <CCol xs="12" md="6" className="mb-2">
                                <CLabel>نام کاربری</CLabel>
                                <CInput name="user_name" type="text" value={this.state.user_name} onChange={(e) => this.handleChange(e)}/>
                            </CCol>
                            <CCol xs="12" md="6">
                                <CLabel>رمز عبور</CLabel>
                                <CInput name="password" type="text" value={this.state.password} onChange={(e) => this.handleChange(e)}/>
                            </CCol>
                        </CRow>
                        <CRow className="justify-content-center">
                            {shops}
                        </CRow>
                    </CCardBody>
                    <CCardFooter>
                        <CRow>
                          <CCol xs="12" md="12" className="ms-auto">
                          <CFormGroup>
                            <CInput onClick={()=>this.handleSubmit()} type="button"  className="btn btn-success btn-pill border border-success" name="submit" value="ثبت" required />
                            </CFormGroup>
                          </CCol>
                      </CRow>
                    </CCardFooter>
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
        userName : state.user.userName,
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserAccess)