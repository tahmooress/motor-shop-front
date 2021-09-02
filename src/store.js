import { createStore } from 'redux'


const initialState = {
  sidebarShow: 'responsive',
  alert : {
        show : false,
        error : false,
        message : "",
      },
  user : {
        userName : "",
        // token : localStorage.getItem('token'),
        token : "",
        accessibility : []
    }
}



export const userLogin = "userLogin";
export const userLogout = "userLogOut";
export const showAlert = "showAlert";

const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set':
      return {...state, sidebarShow : payload.sidebarShow}
    case userLogin:
      // localStorage.setItem('token', rest.user.token)
      return {...state, user : {
        userName : payload.userName,
        token : payload.token,
        accessibility : payload.accessibility
      } }
    case userLogout:
      // localStorage.setItem('token', '')
        return initialState
    case showAlert:
      return {...state, alert : {
        show : payload.show,
        error : payload.error,
        message : payload.message
      }}
    default:
      return {...state , ...payload}
  }
}



const store = createStore(changeState)
export default store