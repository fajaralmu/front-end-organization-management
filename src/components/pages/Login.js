import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Login.css'
import * as menus from '../../constant/Menus'
import InputField from '../input/InputField';
import ActionButton from '../buttons/ActionButton'
import Label from '../Label';
import Message from '../Message'
import { withRouter } from 'react-router';
import ContentTitle from '../layout/ContentTitle';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            showMessageLoginFailed: false
        }



        this.handleUsername = (value) => {
            this.setState({ username: value });
        }
        this.handlePassword = (value) => {
            this.setState({ password: value });
        }

        this.doLogin = () => {

            console.log("u:", this.state.username, ",p:", this.state.password);
            this.props.doLogin(document.getElementById("username-field").value,
                document.getElementById("password-field").value, this.props.main);
        }

        this.endMessage = () => {
            this.setState({ showMessageLoginFailed: false })
        }

        this.validateLoginStatus = () => {
            if (this.props.loginStatus == true) this.props.history.push("/dashboard");
        }
    }


    componentDidMount() {
        this.validateLoginStatus();
        this.props.setMenuCode(menus.LOGIN);
        document.title = "Login";

    }

    componentDidUpdate() {
        this.validateLoginStatus();
        // if(this.props.loginAttempt == false && this.state.showMessageLoginFailed == false){
        //     this.setState({showMessageLoginFailed:true})
        // }
    }

    render() {

        let message = <p>
            {this.props.loginFailed ? <Message endMessage={this.endMessage} type="failed" text="Login Failed" /> : ""}
        </p>

        return (
            <div className="section-container">
                < ContentTitle title="Login Page" />
                {message}
                <div className="login-container">
                    <Label text="Username" />
                    <InputField id="username-field" onKeyUp={this.handleUsername} />
                    <Label text="Password" />
                    <InputField id="password-field" type="password" onKeyUp={this.handlePassword} />
                    <ActionButton style={{margin:'5px'}} id="btn-login" status="submit" onClick={this.doLogin} text="Login" />
                </div>
            </div>
        )
    }
}


export default withRouter(Login);