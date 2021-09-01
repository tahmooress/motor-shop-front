

export class SellHistory{
    constructor(factorNumber, pelakNumber, color, modelName, price, date){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.color = color;
        this.modelName = modelName;
        this.price = price;
        this.date = date;
    }
}

// export class Motor{
//     constructor(pelak_number, body_number, model_name, color, model_year){
//         this.pelakNumber = pelak_number
//         this.body_number = body_number
//         this.model_name = model_name
//         this.color = color
//         this.model_year = model_year
//     }
// }

// export class Factor{
//     constructor(factorNumber, motor, price, date, customer, debts, shop){
//         this.factorNumber = factorNumber;
//         this.motor = motor;
//         this.price = price;
//         this.date = date;
//         this.customer = customer;
//         this.debts = debts;
//         this.shop = shop;
//     }
// }

// export class Demand{
//     constructor(date, price){
//         this.date = date;
//         this.price = price;
//     }
// }

// export class List{
//     constructor(){

//     }
// }

// export class Sale{
//     constructor(factorNumber, pelakNumber, color, price, date, modelName){
//         this.factorNumber = factorNumber;
//         this.pelakNumber = pelakNumber;
//         this.color = color;
//         this.price = price;
//         this.date = date;
//         this.modelName = modelName;
//     }
// }

export class NewFactor{
    constructor(factorNumber, pelakNumber, modelName, color){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.modelName = modelName;
        this.color = color
    }
}

// export class Account {
//     constructor(factorNumber, pelakNumber, customerName, customerLastName, customerMobile, price, date){
//         this.factorNumber = factorNumber;
//         this.pelakNumber = pelakNumber;
//         this.customerName = customerName;
//         this.customerLastName = customerLastName;
//         this.customerMobile = customerMobile;
//         this.price = price;
//         this.date = date;
//     }
// }
export class Account {
    constructor(factorNumber, pelakNumber, customer, price, date){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.customer = customer;
        this.price = price;
        this.date = date;
    }
}
// export class Account extends Customer{
//     constructor()
// }
// export class Recieve{
// //     constructor(factorNumber, pelakNumber, buyerName, buyerLastName, mobile, price, date){
// //         this.factorNumber = factorNumber;
// //         this.pelakNumber = pelakNumber;
// //         this.customerName = customerName;
// //         this.customerLastName = customerLastName;
// //         this.customerMobile = customerMobile;
// //         this.price = price;
// //         this.date = date;
// //     }
// // }

export class HistoryFilter{
    constructor(from, to, shops){
        this.from = from;
        this.to = to;
        this.shops = shops
    }
}

export class Debt{
    constructor(){
        
    }
}

// export class Customer{
//     constructor(name, last_name, mobile, company_name, national_code){
//         this.name = name
//         this.last_name = last_name
//         this.mobile = mobile
//         this.company_name = company_name
//         this.national_code = national_code
//     }
// }

// export class Equity{
//     constructor(amount, status, due_date){
//         this.amount = amount
//         this.status = status
//         this.due_date = due_date
//     }
// }


// new version //

export class Motor{
    constructor(id = null, pelakNumber, bodyNumber,color, modelName, modelYear){
        if (id === "") {
            id = null
        }
        this.id = id;
        this.pelak_number = pelakNumber;
        this.body_number = bodyNumber;
        this.color = color;
        this.model_name = modelName;
        this.model_year = modelYear;
    }
}

export class Customer{
    constructor(id = null,name, lastName, mobile, nationalCode = null,companyName = null){
        if (id === "") {
            id = null
        }

        if (companyName === ""){
            companyName = null
        }

        if (nationalCode === ""){
            nationalCode=null
        }

        this.id = id;
        this.name = name;
        this.last_name = lastName;
        this.mobile = mobile;
        this.national_code = nationalCode;
        this.company_name = companyName;
    }
}

export class Equity {
    constructor(id = null, amount, status = null, dueDate, createdAt = null, updatedAt = null){
        if (status === "") {
            status = null
        }
        this.id = id;
        this.amount = amount;
        this.status = status;
        this.due_date = dueDate;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
}

export class EquityForShow{
    constructor(amount, date){
        this.amount = amount
        this.date = date
    }
}

export class Factor{
    constructor(factor_number, payed_amount, total_amount, created_at,motors, customer = new Customer(), id=null, equities = []){
            if(typeof(payed_amount) != "number"){
                    payed_amount = Number(payed_amount)
            }

            if(typeof(total_amount) != "number") {
                total_amount = Number(total_amount)
            }

            this.factor_number = factor_number;
            this.payed_amount = payed_amount;
            this.total_amount = total_amount;
            this.created_at = created_at;
            this.motors = motors;
            this.customer = customer
            this.id = id;
            this.equities = equities;
    }
}


// constans //

export const URL = "http://127.0.0.1:8000"
export const TOKEN_EXPIRE = "Token is expired"
export const BAD_TOKEN = "token contains an invalid number of segments"

export const CUSTOMER_NOT_EXIST ="مشتری با این شماره موبایل در سیستم موجود نیست"
export const NOT_FOUND = "اطلاعات موجود نیست"



export const DEBTOR = 'DEBTOR'
export const CLEAR = 'CLEAR'
export const DEFFERED = 'DEFERRED'
