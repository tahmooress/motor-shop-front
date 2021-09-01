import React from 'react'
import {
    CDataTable,
    CCollapse,
    CContainer,
    CCardBody,
    CRow,
    CCol,
    CButton
} from '@coreui/react'
import * as models from "../models/models"
import axios from 'axios';
import * as store from "../store";
import { connect } from 'react-redux';
import Pagination from 'src/reusable/Pagination';
import * as util from '../utilities/utilites';
import Alert from 'src/reusable/Alert';
import CIcon from '@coreui/icons-react'

const Accessibility = (props) => {
    const data = props.sourceArray.map((access, index) => {
        return(
            <div className="col-sm-6 col-md-4 form-check" key={index} >
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"  defaultChecked={util.isExist(props.accessArray, access)}/>
            <label className="form-check-label" htmlFor="flexCheckDefault">
                {access.shop_name}
            </label>
            </div>
        )
    })

    return(
        <>
            {data}
        </>
    )
}



const fields = [
    { key: 'نام کاربری', _style: { width: '20%'} },
    { key: 'دسترسی', _style: { width: '75%', textAlign : 'center'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

class Users extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            users : [],
            totalPage : 0,
            currentPage : 1,
            shops : [],
            details : []
        }
    }

    componentDidMount(){
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };      

        const shopsRequest = axios.get(`${models.URL}/shops`,config)
        const usersRequest = axios.get(`${models.URL}/admin`,config)
        
        axios.all([shopsRequest, usersRequest]).then(axios.spread((...responses) => {
            const shopsResponse = responses[0].data
            const usersResponse = responses[1].data
            
            this.setState({
                shops : shopsResponse.data,
                users : usersResponse.data,
                totalPage : usersResponse.meta.last_page,
                currentPage : 1
            })

        }))
        .catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }
            }
            this.setState({
                users : [],
                totalPage : 0,
                currentPage : 1,
                shops : []
            })
        })
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

    handleDelete = (adminID) => {
        const config = {
            headers: {
                "Authorization" : `bearer ${this.props.token}`
            },
        };   

        axios.delete(`${models.URL}/admin/${adminID}`,config)
        .then(response => this.props.onAlert(true,false,"با موفقیت ثبت شد"))
        .then(response => this.componentDidMount())
        .catch(err => {
            if (err.response.data.errors !== null) {
                if (err.response.data.errors[0].detail === models.TOKEN_EXPIRE || err.response.data.errors[0].detail === models.BAD_TOKEN) {
                    this.props.onExit()
                    }
            }

            this.props.onAlert(true,true,err.message)
            
        })
    }

    createAdmin = () => {
        console.log(this.props)
        this.props.history.push(`/create-user`)
    }

  render(){
    const adminsID = []
    const users = this.state.users ? this.state.users.map((user, index) => {
            adminsID.push(user.id)
            return {
                    "نام کاربری" : user.user_name,
                    "دسترسی" : user.shops
                }
    }) : null;
    let pagination = this.state.totalPage ? (
        <div className="row justify-content-center" xs="12" md="8">
        <Pagination  totalPage={this.state.totalPage} handleChangePage={this.handleChangePage} />
    </div>
    ) : null;
      return(
            <> 
            <CContainer>
             <Alert show={this.props.alert.show} message={this.props.alert.message} error={this.props.alert.error}/>
              <CRow>
                  <CCol className="mb-3">
                      <CButton onClick={()=>this.createAdmin()} className="mx-2"><CIcon className="mx-2" name="cil-people"/>ایجاد دسترسی جدید</CButton>
                  </CCol>
              </CRow>
              <CDataTable
              items={users}
              fields={fields}
              scopedSlots = {{
                'دسترسی' : 
                (item,index) => {
                       return(
                           <td>
                                <div className="row justify-content-start" xs="12" md="8">
                                    <Accessibility accessArray={item["دسترسی"]} sourceArray={this.state.shops} />
                                </div>
                           </td>
                       )
                },
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
                                        <CRow  className="justify-content-center"  xs="12" md="8">
                                            <CCol xs="6" md="4" lg="2">
                                                <CButton onClick={() => this.handleDelete(adminsID[index])} size="sm" color="danger" className="btn btn-danger btn-block">
                                                    حذف
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
                {pagination}
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
        onExit : () => dispatch({
            //  type : store.USER_LOGOUT,
              user : {
            token : null,
            accessibility : [],
            userName : ""
        }}),
        onAlert : (show,error,message) => dispatch({ 
            // type : store.SHOW_ALERT,
             alert :{
            show,
            error,
            message,
        } })
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(Users)