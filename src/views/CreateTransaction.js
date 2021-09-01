import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CSelect,
  CRow,
} from '@coreui/react'
import axios from 'axios';
import {userLogin, userLogout, showAlert} from "../store";
import { connect } from 'react-redux';
import Header from "../reusable/header";
import Alert from "../reusable/Alert"
import * as models from "../models/models"
import * as util from "../utilities/utilites";



class CreateTransaction extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            year : "",
            month : "",
            day : "",
            shopID : "",
            factor_number : "",
            amount : "",
            description : "",
            subject : "",
            type : "",
        }
    }

    handleSelectShop = (shopID) => {
        this.setState({
            shopID
        })
    }

    handleChange = (e) => {
        console.log(e.target.name)
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleSubmit = () => {
        if (this.state.shopID === "" || this.state.amount === "" || this.state.year === "" || this.state.month==="" || this.state.day === 0 || this.state.type==="" || this.state.subject === ""){
            return
        }

        const created_at = util.gDate(util.jalaliDate(this.state.year,this.state.month,this.state.day))
        const body = {
            created_at,
            amount : Number(this.state.amount),
            type : this.state.type,
            subject : this.state.subject,
            description : this.state.description,
            factor_number : this.state.factor_number,
            shop_id : this.state.shopID
        }
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      

            axios.post(`${models.URL}/transactions`, JSON.stringify(body), config)
           .then(response => response.data)
           .then(data => {
                this.props.onAlert(true,false, "با موفقیت ثبت شد")
           })
           .catch(err => {
              if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }

                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
               
                return
              }
                try{
                    this.props.onAlert(true,true,err.response.data.errors[0].detail)
                }catch{
                    this.props.onAlert(true,true,err.message)
                }
               })
    }

    render(){
        console.log(this.state)
        return (
            <>  
                <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
                  <CCard>
                    <CCardHeader>
                      ایجاد تراکنش
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                            <CCol>
                                <Header selects={this.props.accessibility} handleSelect = {this.handleSelectShop}/>
                            </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol xs="12" md="6" className="mb-2">
                             <CInput onChange={this.handleChange} type="number" name="amount" placeholder="مبلغ" required />
                        </CCol>
                        <CCol xs="12" md="6">
                            <CRow xs="12" md="6" >
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
                      <CRow className="mb-3">
                        <CCol xs="12" md="6" className="mb-2">
                        <CSelect custom name="subject" id="ccyear" onChange={this.handleChange} >
                                    <option value="">دلیل تراکنش</option>
                                    <option value="EXPENSES">تنخواه</option>
                                    <option value="EQUITY">پرداخت بدهی</option>
                                </CSelect>
                        </CCol>
                        <CCol xs="12" md="6">
                            <CSelect custom name="type" id="ccyear" onChange={this.handleChange} >
                                    <option value="">نوع تراکنش</option>
                                    <option value="PAYED">پرداخت</option>
                                    <option value="RECEIVED">دریافت</option>
                                </CSelect>
                        </CCol>
                      </CRow>
                    <CRow >
                        <CCol>
                        <CFormGroup >
                                <CInput onChange={this.handleChange} name="description" id="text-input" placeholder="توضیحات" />
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" md="6" className="mb-2">
                             <CInput onChange={this.handleChange} type="text" name="factor_number" placeholder="شماره فاکتور" />
                        </CCol>
                        <CCol>
                            <CInput onClick={()=>this.handleSubmit()} type="button"  className="btn btn-primary btn-pill border border-primary"  value="ثبت" />
                        </CCol>
                    </CRow>
                    </CCardBody>
                  </CCard>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateTransaction)

