import {CAlert, CButton } from '@coreui/react'
import React from "react";
import {connect} from "react-redux";
import {showAlert, userLogout} from "../store"


class Alert extends React.Component {
  handleClose = () => {
    this.props.onAlert(false,false,"")
  }
    render(){ 
      return(
        <div className="mt-2">
        <CAlert  show={this.props.show} color={this.props.error ? "danger" : "success"} >
          <CButton onClick={() => this.handleClose()} >close</CButton>
          {this.props.message}
        </CAlert>
      </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Alert)