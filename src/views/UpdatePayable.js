import React from 'react'
import {
    CCard,
    CCardHeader,
    CInput,
    CFormGroup,
    CContainer,
    CCardBody,
    CCol,
    CButton,
    CRow,
    CSelect,
    CLabel
} from '@coreui/react'
import * as models from "../models/models"
import axios from 'axios';
import {userLogout, showAlert} from "../store";
import { connect } from 'react-redux';
import Alert from 'src/reusable/Alert';
import * as util from "../utilities/utilites";

class UpdatePayable extends React.Component{
    constructor(props){
        super(props)
        this.state = {
                year : "",
                month : "",
                day : "",
                amount : ""
        }
    }

    handleChange = (e) => {
        this.setState({
           [e.target.name] : e.target.value
        })
    }

    handleClear = ()=>{
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };    
        axios.put(`${models.URL}/debts/${this.props.match.params.id}`, null,config)
            .then(response => {
                this.props.onAlert(true,false,"با موفقیت ثبت شد")
            }).catch(err =>{
                this.props.onAlert(true,true,err.message)
            })
    }

    handleSubmit = ()=>{
        if (this.state.amount === "" || this.state.year === "" || this.state.month === "" || this.state.day === "") {
            return
        }
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };    

            let next_due_date = util.gDate(util.jalaliDate(this.state.year,this.state.month,this.state.day), true);

            const body = {
                id : this.props.match.params.id,
                payed_amount : Number(this.state.amount),
                next_due_date
            }
            

            axios.post(`${models.URL}/debts`, JSON.stringify(body), config)
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
                        <CButton >بروز رسانی حساب پرداختی</CButton>
                    </CCardHeader>
                    <CCardBody>
                    <CRow className="mb-3">
                        <CCol xs="12" md="6" className="mb-2">
                            <CLabel>مبلغ پرداختی</CLabel>
                             <CInput onChange={this.handleChange} type="number" name="amount" placeholder="مبلغ" required />
                        </CCol>
                        <CCol xs="12" md="6">
                            <CLabel>تاریخ پرداخت مانده</CLabel>
                            <CRow className="mb-1" xs="12" md="6" >
                            <CCol xs="4">
                                    <CSelect custom name="year" id="ccyear" onChange={this.handleChange} >
                                    <option value="">سال</option>
                                    <option value="1398">1398</option>
                                    <option value="1399">1399</option>
                                    <option value="1400">1400</option>
                                    <option value="1401">1401</option>
                                    <option value="1402">1402</option>
                                    <option value="1403">1403</option>
                                    <option value="1404">1404</option>
                                    <option value="1405">1405</option>
                                    <option value="1406">1406</option>
                                    <option value="1407">1407</option>
                                    </CSelect>
                                </CCol>
                                <CCol xs="4">
                                    <CSelect custom name="month" id="ccmonth" onChange = {this.handleChange}>
                                    <option value="1">ماه</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    </CSelect>
                                </CCol>
                                <CCol xs="4" >
                                    <CSelect custom name="day" id="day" onChange={this.handleChange}>
                                    <option>روز</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    </CSelect>
                                </CCol>    
                            </CRow>
                        </CCol>
                      </CRow>
                        <div className="row justify-content-center" xs="12" md="8">
                            <CCol xs="12" md="6" className="ms-auto">
                                 <CFormGroup>
                                    <CInput onClick={()=>this.handleSubmit()} type="button"  className="btn btn-primary btn-pill border border-primary" name="submit" value="ثبت" required />
                                </CFormGroup>
                          </CCol>
                          <CCol xs="12" md="6" className="ms-auto">
                                 <CFormGroup>
                                    <CInput onClick={()=>this.handleClear()} type="button"  className="btn btn-primary btn-pill border border-primary" name="submit" value="تسویه کامل" required />
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePayable)