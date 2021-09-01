import React from "react";
import { CPagination } from '@coreui/react'

class Pagination extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            curentPage : 1
        }
    }
    setActivePage = (page) => {
        this.setState({
           curentPage : page
       })
       this.props.handleChangePage(page)
    }

    render(){
        return (
            <div className={'mt-2'} >
              <CPagination
                activePage={this.state.curentPage}
                pages={this.props.totalPage}
                onActivePageChange={(i) => this.setActivePage(i)}
              ></CPagination>
            </div>
          )
    }
}

export default Pagination;