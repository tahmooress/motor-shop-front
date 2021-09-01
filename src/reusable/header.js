import React, { Components } from "react";
import {CLabel, CSelect} from '@coreui/react'

class Header extends React.Component {
    render(){
        let options = this.props.selects.map((item, index)=>{
            return(
                <option key={index} value={item.id}>{item.shop_name}</option>
            )
        })
        return(
            <>
                <CLabel htmlFor="header" className="text-right">فروشگاه</CLabel>
                <CSelect custom name="header" id="header" onChange={(e) => this.props.handleSelect(e.target.value)} >
                    <option value="">انتخاب فروشگاه</option>
                    {options}
                </CSelect>
            </>
        )
    }
}

export default Header;