import moment from "jalali-moment";
import * as models from "../models/models";

export const jalaliDate = (year, month, day) => `${year}/${month}/${day}`

export const getBadge = status => {
    switch (status) {
      case models.CLEAR: return 'success'
      case models.DEBTOR: return 'warning'
      case models.DEFFERED: return 'danger'
      default: return 'primary'
    }
  }

export const gDate = (jDate, zulu=false) => {
    if (zulu){
        return new Date(moment.from(jDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')).toISOString()
    }

    return new Date(moment.from(jDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD'))
}

// thousend seprator for numbers
export const seprator = function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const getStatus = (status) => {
    switch(status){
        case models.CLEAR:
            return "تسویه"
        case models.DEBTOR:
            return "بدهکار"
        case models.DEFFERED:
            return "معوق"
    }
}

export const getFactorBadge = (status) => {
    switch(status) {
        case "تسویه":
            return 'success'
        case "بدهکار":
            return 'warning'
        case "معوق":
            return 'danger' 
    }
}

export const factorStatus = (total, payed) => {
    if (Number(total) > Number(payed)){
        return "بدهکار"
    }

    if (Number(total) === Number(payed)) {
        return "تسویه"
    }

    return ""
}   

export const calculateEquities = (monthlyPay ,number, gDate) => {
    let year = gDate.getFullYear()
    let month = gDate.getMonth()
    let day = gDate.getDate()

    let equities = []

    equities.push(new models.Equity(null, monthlyPay, models.DEBTOR, gDate.toISOString()))

    for (let i=1; i < number; i++) {
        let y = year
        let m = month
        let d = day
        
        y = Math.floor(year + ((m + i ) / 12))
        m = (m+i) % 12

        let next = ""

       if (m === 11 ) {
         next = new Date(y+1, 0, 0)
         
       }
        else {
         next = new Date(y, m+1, 0)
       
       }

       let lastDayOfNext = next.getDate()

        if (d > lastDayOfNext) {
            d = lastDayOfNext
        }  
        
        
        equities.push(new models.Equity(null, monthlyPay, models.DEBTOR, new Date(y, m,d).toISOString()))
        
    }

    return equities
}


export const isExist = (sourceArray, targetElement) => {
    const sourceIterator = sourceArray.keys()

    for (const key of sourceIterator) {
                if (sourceArray[key].id === targetElement.id){
                    return true
                }
                continue
    }

    return false
}

export const deleteAccess = (source, accessID) => {
    
    const arr = [...source]

    for( var i = 0; i < arr.length; i++){ 
    
        if ( source[i] === accessID) { 
    
            arr.splice(i, 1); 
        }
    
    }

    return arr
}

export const txStatus = (status) => {
    if (status === "PAYED") {
            return "پرداخت"
    }

    if (status === "RECEIVED"){
        return "دریافت"
    }

    if (status === "EXPENSES") {
        return "تنخواه"
    }

    if (status === "EQUITY") {
        return "بدهی"
    }
}

export const txStatusStyle = (status) => {
    if (status === "دریافت"){
        return 'success'
    }

    if (status === "پرداخت"){
        return 'warning'
    }
}


export const getUserShops = (users, userName) => {
    const usersIterator = users.keys()

    for (const key of usersIterator) {
               if (users[key].user_name === userName) {
                   return users[key].shops
               }
    }

    return []
}