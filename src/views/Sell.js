import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CSelect,
  CRow,
  CCardTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { userLogout, showAlert } from "../store";
import { connect } from 'react-redux';
import Header from "../reusable/header";
import MotorResult from "../reusable/motorResult";
import CustomerResult from "../reusable/customerResult";
import Alert from "../reusable/Alert"
import * as models from "../models/models"
import * as util from "../utilities/utilites";
import Factor from "../reusable/Factor";


class Sell extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            year : "",
            month : "",
            day : "",
            fyear : "",
            fmonth : "",
            fday : "",
            total_amount : 0,
            payed_amount : 0,
            factor_number : "",
            created_at : "",
            shopID : "",
            showMotorResult : false,
            showCustomerResult : false,
            motors : [],
            equities : [],
            customer : new models.Customer(),
            cutm : new models.Customer(),
            motor : new models.Motor(),
            firstPay : "",
            equitiesNumber : 0,
            finalFactor : new models.Factor(),
            showResultFactor : false
        }
    }

    handleMotorSearch = (e) => {
        if (this.state.pelak_number === "") {
            return
        }
          const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };
                axios.get(`${models.URL}/motor/${this.state.pelak_number}`,config
                )
               .then(response => response.data)
               .then(data => {
                   let motor = new models.Motor(data.id, data.pelak_number, data.body_number, data.color, data.model_name, data.model_year)
                   this.setState({
                    showMotorResult : true,
                    motor
                })
               })
               .catch(err => {
                  if (err.response.data.errors !== null) {
                    if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                        this.props.onExit()
                        return
                        }

                    this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                   
                    return
                  }
                  this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
               })
    }

    handleCustomerSearch = (e) => {
        if (this.state.mobile === "") {
            return
        }               
      const config = {
        headers: {
            "Authorization" : `bearer ${this.props.token}`
        },
    };      

            axios.get(`${models.URL}/customers?filter[mobile]=${this.state.mobile}`,config)
           .then(response => response.data)
           .then(customer => {
               if (customer.meta.total === 0) {
                this.props.onAlert(true, true,models.CUSTOMER_NOT_EXIST)

                return
               } 
                customer = new models.Customer(customer.data[0].id,customer.data[0].name,customer.data[0].last_name, customer.data[0].national_code, customer.data[0].mobile, customer.data[0].company_name)
                this.setState({
                    showCustomerResult : true,
                    cutm : customer
                })
           }).catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    return
                    }
                
                this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])

                return
                }

                this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
           })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleSelect = (shopID) => {
        this.setState({
            shopID
        })
    }

    handleCloseCustomer = () => {
        this.setState({
            showCustomerResult : false,
            cutm : new models.Customer(),
        })
    }

    handleCloseMotor = () => {
        this.setState({
            showMotorResult : false,
            motor : new models.Motor(),
        })
    }

    handleAddCustomer = (customer) => {
        this.setState({
            customer,
            cutm : new models.Customer()
        })
    }

    handleAddMotor = (motor) => {
        this.setState(state => {
            return {
                motors : [...state.motors, motor],
                motor : new models.Motor()
            }
        })
       
    }

    handleShowCustomeResult =() => {
        this.setState({
            showCustomerResult : true,
        })
    }

    handleShowMotorResult = () => {
        this.setState({
            showMotorResult : true
        })
    }

    handleValidateFactor = () => {
        if(this.setState.shopID === "" || this.state.factor_number === "" || this.state.year === "" || this.state.month === "" || this.state.day === "" || this.state.total_amount === ""){
            return
        }

        if( !this.state.fyear || !this.state.fmonth|| !this.state.fday || !this.state.equitiesNumber || !this.state.total_amount) {
            return
        }

        if (this.state.customer.name === "" || this.state.customer.last_name ==="" || this.state.customer.mobile=== ""){
            return 
        }

        let firstPay = ""

        try {
            firstPay = util.gDate(util.jalaliDate(this.state.fyear,this.state.fmonth,this.state.fday))
        } catch (error) {
            this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
        }

        let monthlyPay = (Number(this.state.total_amount) - Number(this.state.payed_amount)) / Number(this.state.equitiesNumber)

        if (monthlyPay <= 0) {
            return
        }


        let equities = []

        try {
            equities= util.calculateEquities( monthlyPay, Number(this.state.equitiesNumber), firstPay)
        } catch (error) {
            this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
        }

        let created_at = ""

        try {
            created_at =  util.gDate(util.jalaliDate(this.state.fyear,this.state.fmonth,this.state.fday), true);
        } catch (error) {
            this.props.onAlert(true,true,"خطایی در سیستم رخ داده")
        }
        
        let factor = new models.Factor(this.state.factor_number, this.state.payed_amount, this.state.total_amount, created_at, this.state.motors, this.state.customer, null,equities)
       
        this.setState({
            finalFactor : factor,
            showResultFactor : true,
            equities
        })
    }

    handleSubmit = () => {
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      

                let data = {
                    shop_id : this.state.shopID,
                    factor : this.state.finalFactor
                }

                axios.post(`${models.URL}/sell`, JSON.stringify(data), config)
               .then(response => response.data)
               .then(data => {
                this.props.onAlert(true,false,"با موفقیت ثبت شد")
                this.setState({
                    year : "",
                    month : "",
                    day : "",
                    fyear : "",
                    fmonth : "",
                    fday : "",
                    total_amount : 0,
                    payed_amount : 0,
                    factor_number : "",
                    created_at : "",
                    shopID : "",
                    showMotorResult : false,
                    showCustomerResult : false,
                    motors : [],
                    equities : [],
                    customer : new models.Customer(),
                    cutm : new models.Customer(),
                    motor : new models.Motor(),
                    firstPay : "",
                    equitiesNumber : 0,
                    finalFactor : new models.Factor(),
                    showResultFactor : false
                })
               })
               .catch(err => {
                  if (err.response.data.errors !== null) {
                    if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                        this.props.onExit()
                        return
                        }

                    this.props.onAlert(true, true,err.response.data.errors[0]["detail-locale"])
                    
                    this.setState({
                        year : "",
                        month : "",
                        day : "",
                        fyear : "",
                        fmonth : "",
                        fday : "",
                        total_amount : 0,
                        payed_amount : 0,
                        factor_number : "",
                        created_at : "",
                        shopID : "",
                        showMotorResult : false,
                        showCustomerResult : false,
                        motors : [],
                        equities : [],
                        customer : new models.Customer(),
                        cutm : new models.Customer(),
                        motor : new models.Motor(),
                        firstPay : "",
                        equitiesNumber : 0,
                        finalFactor : new models.Factor(),
                        showResultFactor : false
                    })

                    return
                  }
                   this.props.onAlert(true,true,"خطایی در سیستم رخ داده")

                   this.setState({
                    year : "",
                    month : "",
                    day : "",
                    fyear : "",
                    fmonth : "",
                    fday : "",
                    total_amount : 0,
                    payed_amount : 0,
                    factor_number : "",
                    created_at : "",
                    shopID : "",
                    showMotorResult : false,
                    showCustomerResult : false,
                    motors : [],
                    equities : [],
                    customer : new models.Customer(),
                    cutm : new models.Customer(),
                    motor : new models.Motor(),
                    firstPay : "",
                    equitiesNumber : 0,
                    finalFactor : new models.Factor(),
                    showResultFactor : false
                })
               })
    }

    render(){
        let motorResult = this.state.showMotorResult ? <MotorResult handleClose ={this.handleCloseMotor} handleAddMotor = {this.handleAddMotor} motor={this.state.motor}/> : null;
        let customerResut = this.state.showCustomerResult ? <CustomerResult handleClose={this.handleCloseCustomer} handleAddCustomer={this.handleAddCustomer} customer={this.state.cutm} /> : null;
        return (
            <>  
                <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
                  <CCard>
                    <CCardHeader>
                      ایجاد فاکتور فروش
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                            <CCol>
                                <Header selects={this.props.accessibility} handleSelect = {this.handleSelect}/>
                            </CCol>
                      </CRow>
                      <CRow>
                        <CCol >
                            <CCardTitle>مشخصات فکتور</CCardTitle>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol xs="12" md="6" className="mb-2">
                             <CInput onChange={this.handleChange} type="text" name="factor_number" placeholder="شماره فاکتور" required />
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
                        <CCol xs="12" md="6">
                            <CFormGroup>
                                <CInput onChange={this.handleChange} type="number" name="total_amount" placeholder="مبلغ کل" required />
                            </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                            <CFormGroup>
                                <CInput onChange={this.handleChange} type="number" name="payed_amount" placeholder="مبلغ پرداخت شده" required />
                            </CFormGroup>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol >
                            <CCardTitle >مشخصات موتور</CCardTitle>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol xs="12" md="6" className="mb-3">
                            <CInputGroup>
                            <CInput  onChange={this.handleChange} type="text" name="pelak_number" placeholder="جستجو با شماره پلاک" />
                            <CInputGroupPrepend>
                                <CButton size="sm" onClick = {() => this.handleMotorSearch()} type="button" color="primary"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                            </CInputGroupPrepend>
                            </CInputGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                            {/* <CFormGroup>
                                <CInput  name="" onClick={this.handleShowMotorResult} placeholder="افزودن موتور" required />
                            </CFormGroup> */}
                        </CCol>
                      </CRow>
                      {motorResult}
                      <CRow >
                        <CCol >
                            <CCardTitle >مشخصات مشتری</CCardTitle>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol xs="12" md="6" className="mb-3">
                            <CInputGroup>
                            <CInput  onChange={this.handleChange} type="text" name="mobile" placeholder="جستجو با شماره موبایل" />
                            <CInputGroupPrepend>
                                <CButton size="sm" onClick = {() => this.handleCustomerSearch()} type="button" color="primary"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                            </CInputGroupPrepend>
                            </CInputGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                            <CFormGroup>
                                <CInput  name="button" className="btn btn-primary btn-pill border border-primary" onClick={this.handleShowCustomeResult} placeholder="افزودن مشتری" readOnly />
                            </CFormGroup>
                        </CCol> 
                      </CRow>
                        {customerResut}
                        <CRow >
                            <CCol >
                                <CCardTitle >محاسبه اقساط</CCardTitle>
                            </CCol>
                        </CRow>
                      <CRow>
                        <CCol xs="12" md="6">
                            <CFormGroup>
                                <CInput onChange={this.handleChange} name="equitiesNumber" placeholder="تعداد اقساط" />
                            </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                            <CRow xs="12" md="6" className="mb-3">
                            <CCol xs="4">
                                    <CSelect custom name="fyear" id="ccyear" onChange={this.handleChange} >
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
                                    <CSelect custom name="fmonth" id="ccmonth" onChange = {this.handleChange}>
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
                                    <CSelect custom name="fday" id="day" onChange={this.handleChange}>
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
                      <CRow >
                      <CCol xs="12" md="6">
                            <CFormGroup>
                                <CInput name="remainAmount" placeholder="مبلغ مانده" disabled  value={(Number(this.state.total_amount) > Number(this.state.payed_amount)) ? util.seprator( Number(this.state.total_amount) - Number(this.state.payed_amount))  : "مبلغ مانده"} />
                            </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6" className="ms-auto">
                          <CFormGroup>
                            <CInput onClick={()=>this.handleValidateFactor()} type="button"  className="btn btn-info btn-pill border border-info" name="validate" value="نمایش فاکتور" required />
                            </CFormGroup>
                          </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                {this.state.showResultFactor ?  (
                    <>
                        <Factor factor={this.state.finalFactor}/>
                        <CRow>
                          <CCol xs="12" md="12" className="ms-auto">
                          <CFormGroup>
                            <CInput onClick={()=>this.handleSubmit()} type="button"  className="btn btn-success btn-pill border border-success" name="validate" value="ثبت فاکتور" required />
                            </CFormGroup>
                          </CCol>
                      </CRow>
                    </>
                ) : null }
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
export default connect(mapStateToProps, mapDispatchToProps)(Sell)


