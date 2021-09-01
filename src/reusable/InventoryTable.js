import React from 'react'
import {
    CDataTable,
} from '@coreui/react';



  const fields = [
    { key: 'شماره فاکتور'},
    { key: 'پلاک'},
    { key: 'مدل' },
    { key: 'رنگ' },
    { key: 'شماره شاسی' },
    { key: 'سال تولید' },
  ]

  class InventoryTable extends React.Component{
      render(){
          console.log(this.props.stocks)
        let stocks = this.props.stocks ? this.props.stocks.map((stock, index) => {
            return  {
                id : index,
                'شماره فاکتور' : stock.factor_number,
                'پلاک' : stock.motor.pelak_number,
                'مدل' : stock.motor.model_name,
                'رنگ' : stock.motor.color,
                'شماره شاسی' : stock.motor.body_number,
                'سال تولید' : stock.motor.model_year
            }
        }) : []
        return (
            <>  
               <CDataTable
              items={stocks}
              fields={fields}
            />
            </>
          )
      }
  }


export default InventoryTable

