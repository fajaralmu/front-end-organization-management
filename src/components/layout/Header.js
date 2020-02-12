import React, { Component } from 'react';
import '../../css/Header.css'
import ToggleButton from '../buttons/ToggleButton';
import * as config from '../../utils/WebConfig'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            debugMode:true
        }
        this.handleClick = (e) => {
            this.setState({ debugMode: !this.state.debugMode })
            if (this.state.debugMode == true) {
                localStorage.setItem("debugMode", "true");
            } else {
                localStorage.setItem("debugMode", "false");
            }
            console.log("ccc localStorage.setItem(\"debugMode\")", localStorage.getItem("debugMode"));
            this.props.app.componentDidMount();
        }
    }

    render() {

        const debugMode =  localStorage.getItem("debugMode");
        const isDebugMode =  localStorage.getItem("debugMode") == "true";
        return (
            <div className="App-header">
                {this.props.title}
                <ToggleButton active={isDebugMode} onClick={this.handleClick} text={"Debug Mode: "+debugMode} />
            </div>
        )
    }

}

export default Header;