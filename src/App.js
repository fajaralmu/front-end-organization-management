
import React, { Component } from 'react'; 
import './App.css';

import Header from './components/layout/Header'
import Menu from './components/buttons/Menu'
import Home from './components/pages/Home'
import About from './components/pages/About'
import {  Route, Link, Switch, withRouter } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import { connect } from 'react-redux'  
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import * as menus from './constant/Menus'
import Message from './components/Message';
import Footer from './components/layout/Footer';
import SockJsClient from 'react-stomp';
import ChatRoom from './components/pages/ChatRoom';
import Management from './components/pages/Management'; 
import { uniqueId } from './utils/StringUtil';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      detailMode: false,
      menuCode: '',
      loading: false,
      loadingPercentage: 0,
      requestId: null,
      enableShopping: false,
      mainAppUpdated:new Date()
    };

    this.setDetailMode = (detailMode) => {
      this.setState({ detailMode: detailMode });
    }

    this.setMenuCode = (code) => { 
      this.setState({ menuCode: code });
    }

    this.refresh = () => {
      this.setState({ mainAppUpdated: new Date() });
    }

    this.setEnableShopping = (val) => {
      this.setState({ enableShopping: val })
    }

    this.handleMenuCLick = (menu) => {
      switch (menu.code) {

        case menus.LOGOUT:
          if (!window.confirm("Are you sure want to logout?")) {
            return;
          }
          this.props.performLogout(this);
          break;

        default:
          break;
      }


    }



    this.requestAppId = () => {
      this.props.requestAppId(this);
    }

    this.startLoading = (realtime) => {
      this.setState({ loading: true, realtime: realtime });
    }
    this.endLoading = () => {
      this.setState({ loading: false, loadingPercentage: 0 });
    }

    this.handleMessage = (msg) => {
      let percentage = Math.floor(msg.percentage);
      // this.startLoading(true);
     
      // if(msg.requestId != localStorage.getItem("requestId")){
      //   return;
      // }

      // if (msg.percentage < 0 || msg.percentage > 100) {
      //   this.endLoading();
      // }
      // this.setState({ loadingPercentage: percentage });
    }
  }



  componentDidUpdate() {
    if (this.props.requestId != this.state.requestId) {
      this.setState({ requestId: this.props.requestId });
      localStorage.setItem("requestId", this.props.requestId);
      this.props.refreshLogin(this.props.loginStatus);
    }

    console.log("App componentDidUpdate LOGIN STATUS: ",this.props.loginStatus)
  }

  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  setMenus() {
    let additionalMenus = this.props.menus
    let menus = new Array();
    for (let i = 0; i < additionalMenus.length; i++) {

      let menu = additionalMenus[i];

      if(!this.state.enableShopping && menu.code == 'cart')
        continue;

      if (this.props.loginStatus != true && menu.authenticated == true)
        continue;

      menus.push(menu);

    }
 
    return menus;

  }

  render() {

    const header =  <Header app={this} title="MPI Monitoring"   />;

    if (!this.state.requestId) {
      return (
        <div key={uniqueId()}>
          {header}
          Please wait..
        </div>
      )
    }

    let loginComponent = <Login main={this} setMenuCode={this.setMenuCode}
      setDetailMode={this.setDetailMode}
      detailMode={this.state.detailMode}
      doLogin={this.props.performLogin}
      loginFailed={this.props.loginFailed}
      loginAttempt={this.props.loginAttempt}
      loginStatus={this.props.loginStatus}
    />;

    let loadingComponent = "";
    if (this.state.loading == true) {
      loadingComponent = <Message realtime={this.state.realtime} progress={this.state.loadingPercentage} text="Please wait..." type="loading" />;
    }

    let menus = this.setMenus();
 
    let cloudHost = "https://nuswantoroshop.herokuapp.com/";
    let localHost = "http://localhost:8080/organization-management/";
    const usedHost = localHost;
    return (
      <div className="App">
        {loadingComponent}
        {header}
        {/*this.props.loginStatus == true?"Logged In":"Un Logged"*/}
      
        <div id="main-layout">
          <div id="main-menu">
            <Menu loggedUser={this.props.loggedUser}
              division = {this.props.division}
              handleMenuCLick={this.handleMenuCLick}
              activeCode={this.state.menuCode}
              menus={menus} />
          </div>
         
          <div id="main-content" > 
            <Switch>
              <Route exact path="/" render={
                (renderProps) =>
                  <Home setMenuCode={this.setMenuCode} content="hello, this is default page" />
              } />
              <Route exact path="/home" render={
                (renderProps) =>
                  <Home setMenuCode={this.setMenuCode} content="hello, this is home page" />
              } />
              
              <Route exact path="/chatroom" render={
                (renderProps) =>
                  <ChatRoom app={this} setMenuCode={this.setMenuCode} />
              } />
              <Route exact path="/about" render={
                (renderProps) =>
                  <About setMenuCode={this.setMenuCode} />
              }></Route>
               
               <Route exact path="/login" render={
                (renderProps) => loginComponent

              }></Route>

              {/*
                     =============================
                     ======== need login =========
                     =============================
                     */}
              <Route exact path="/dashboard" render={
                (renderProps) =>
                  <Dashboard app={this} loginStatus={this.props.loginStatus} setMenuCode={this.setMenuCode} />

              }></Route>
               <Route exact path="/management" render={
                (renderProps) =>
                  <Management app={this} loginStatus={this.props.loginStatus}   setMenuCode={this.setMenuCode} />

              }></Route>
            </Switch>
           
          </div>
         
        </div>
        <SockJsClient url={usedHost+'realtime-app'} topics={['/wsResp/progress']}
          onMessage={(msg) => { this.handleMessage(msg) }}
          ref={(client) => { this.clientRef = client }} />
        <Footer />

      </div>
    )
  }

}
const mapStateToProps = state => {
  //console.log(state);
  return {
    entities: state.shopState.entities,

    //user
    loginStatus: state.userState.loginStatus,
    loginKey: state.userState.loginStatus,
    loginFailed: state.userState.loginFailed,
    menus: state.userState.menus,
    loggedUser: state.userState.loggedUser,
    loginAttempt: state.userState.loginAttempt,
    requestId: state.userState.requestId,
    division: state.userState.division,
    cart: state.shopState.cart
  }
}

const mapDispatchToProps = dispatch => ({
  performLogin: (username, password, app) => dispatch(actions.performLogin(username, password, app)),
  performLogout: (app) => dispatch(actions.performLogout(app)),
  requestAppId: (app) => dispatch(actions.requestAppId(app)),
  refreshLogin: (loginStatus) => dispatch(actions.refreshLoginStatus(loginStatus))
  // getProductCatalog: (page) => dispatch(actions.getProductList(page))

})
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
