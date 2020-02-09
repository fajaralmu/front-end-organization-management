import React, { Component } from 'react'
import '../../css/Menu.css'
import '../../css/Common.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
const logoUrl = "http://localhost:50084/Asset/Images/transparent.png";
class Menu extends Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate() {
    }

    render() {
        let userLink = "";
        let divisionInfo = null;
        if (this.props.division) {
            divisionInfo = <div className="fill" >{this.props.division.name} </div>;
        }

        if (this.props.loggedUser != null) {
            userLink = <li id="user-link">
                <div className="fill" >{"Welcome, " + this.props.loggedUser.name} </div>
                {divisionInfo}
            </li>
        }

        let appIcon = <li><img src={logoUrl} style={{ width: '90%' }} /></li>;

        let renderedMenus = [{
            icon: true,
            url: logoUrl
        }];


        if (this.props.menus != null) {
            renderedMenus = this.props.menus;
        }

        return (

            <div className="side-menu" >
                < ul className="menu-ul " >
                    {appIcon}
                    {userLink}
                    {
                        renderedMenus.map(
                            e => {
                                if (e.url == "#") {
                                    return (<li onClick={() => this.props.handleMenuCLick(e)} className={this.props.activeCode == e.code ? "active" : ""} key={e.name}
                                        id={e.name}> <Link key={e.name} className="App-link"
                                            to="#" ><div className="fill" >{e.name} </div></Link></li >
                                    )
                                }
                                return (<li className={this.props.activeCode == e.code ? "menu-active" : ""} key={e.name}
                                    id={e.name}> <Link key={e.name} className="App-link"
                                        to={e.url} ><div className="fill" >{e.name} </div></Link></li >
                                )
                            }
                        )
                    } </ul>

            </div>

        )
    }
}

export default Menu;