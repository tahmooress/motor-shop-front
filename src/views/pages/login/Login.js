import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {showAlert, userLogin} from "../../../store";
import Alert from 'src/reusable/Alert';
import { connect } from 'react-redux';


class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      toke : "",
      user_name : "",
      password : ""
    }
  }

  handleChange = (e) => {
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  handleSubmit = (e)=>{
    const URL = "http://127.0.0.1:8000/login";
    let data = {
      user_name : this.state.user_name,
      password : this.state.password
    }
    axios.post(URL,JSON.stringify(data))
    .then(res => res.data)
    .then(data=>{
        let user = {
            userName : this.state.user_name,
            token : data.token,
            accessibility : data.admin.shops
        }
        return user
    })
    .then(user => {
      this.props.onLogin(user.userName, user.token, user.accessibility)
      this.props.history.push("/")
    })
    .catch(err=>{
      if (err.response.data.errors !== null) {
        this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
        this.setState({
          toke : "",
          user_name : "",
          password : ""
        })

        return
          }
          this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
          this.setState({
            toke : "",
            user_name : "",
            password : ""
          })
    })
}

  render(){
    return (
      <React.Fragment>
        <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
        <div className="c-app c-default-layout flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md="8">
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <CForm>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-user" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput onChange={this.handleChange} type="text" value={this.state.user_name} placeholder="Username" autoComplete="username" name="user_name"/>
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput   onChange={this.handleChange} value={this.state.password} type="password" placeholder="Password" autoComplete="current-password" name="password" />
                        </CInputGroup>
                        <CRow>
                          <CCol xs="6">
                            <CButton onClick={this.handleSubmit} color="primary" className="px-4">Login</CButton>
                          </CCol>
                          <CCol xs="6" className="text-right">
                            <CButton color="link" className="px-0">Forgot password?</CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                  <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                    <CCardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                          labore et dolore magna aliqua.</p>
                        <Link to="/register">
                          <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                        </Link>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch)=>{
  return{
      onLogin : (userName, token , accessibilt)=> dispatch({type :userLogin, payload : {
        userName :userName,
        token : token,
        accessibility :accessibilt
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
const mapStateToProps = (state) =>{
  return {
    token : state.user.token,
    accessibility : state.user.accessibility,
    alert : state.alert,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
