import React from 'react'
import {
  CButton,
  CDropdown,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {userLogout} from "../store"



const LogOut = (props) => {
  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
    <CButton size="md" data-coreui-toggle="tooltip" data-coreui-placement="top" title="Logout" onClick={() => props.dispatch({type :userLogout})}><CIcon name="cil-chevron-right"/></CButton>
    </CDropdown>
  )
}

export default LogOut;