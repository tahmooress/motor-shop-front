import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as store from "./store";
import './scss/style.scss';



const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect : ""
    }
  }
  static getDerivedStateFromProps(props, current_state) {
    console.log("new goh khoria from outside")
    if (!props.token) {
      return {
        redirect : "/login"
      }
    }
    return {
        redirect : ""
    }
  }
  // componentDidMount(){
  //   if(!this.props.token){
  //     console.log("here")
  //     try {
  //       this.setState({ redirect: "/login" });
  //       console.log("asdasdasd")
  //     } catch (error) {
  //       console.log("eror",error)
  //     }  
  //   }
  // }

  // componentDidUpdate(){
  //   console.log("out of if ")
  //   if(!this.props.token){
  //     console.log("inside if")
  //         console.log("here")
  //         try {
  //           this.setState({ redirect: "/login" });
  //           console.log("asdasdasd")
  //         } catch (error) {
  //           console.log("eror",error)
  //         }  
  //       }
  // }
  // componentWillReceiveProps(nextProps) {
  //   // You don't have to do this check first, but it can help prevent an unneeded render
  //   console.log("from watcher....", nextProps)
  //   if (!nextProps.token) {
  //     console.log("inside of watcher...............")
  //     this.setState({ redirect: "/login" });
  //   }
  // }
  
  render() {
    console.log(this.state)
    return (
      <>
        <HashRouter>
          <React.Suspense fallback={loading}>
          {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
              </Switch>
              </React.Suspense>
      </HashRouter>
      </>

    );
  }
}

const mapStateToProps = (state) => {
  return {
      token : state.user.token,
      accessibility : state.user.accessibility
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
      onExit : () => dispatch({ type : store.userLogout, user : {
          token : null,
          accessibility : [],
          userName : ""
      }})
          }
} 

export default connect(mapStateToProps, mapDispatchToProps)(App)