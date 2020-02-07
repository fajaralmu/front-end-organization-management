import React, { Component } from 'react'
import '../css/Common.css'
import '../css/Dashboard.css'
import * as menus from '../constant/Menus'
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import * as actions from '../redux/actionCreators'
import Tab from './Tab';
import ContentTitle from './ContentTitle';
import DashboardMain from './DashboardMain';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: "home"
        }

        this.setFeatureCode = (code) => {
            this.setState({ featureCode: code });
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }
        this.getDivisons = () => {  
            this.props.getDivisons( this.props.app);  
        }

        this.selectDivision = (divisionId) => {
            this.props.selectDivision(divisionId, this.props.app);
        }
    }

    componentDidMount() {
        this.validateLoginStatus();
        if (this.props.loginStatus != true)
            return;
        this.props.setMenuCode(menus.DASHBOARD);
        document.title = "Dashboard";

        this.getDivisons();
    }
    getButtonsData = () => {
        return [
            {
                text: "Home",
                active: this.state.menu == "home",
                onClick: () => { }
            },
            {
                text: "Time Line",
                active: false
            } 
        ];
    }
 
    componentDidUpdate() {
        this.validateLoginStatus();
    }

    render() {
        const buttonsData = this.getButtonsData();

        let content = null;
        switch (this.state.menu) {
            case 'home':
                content = <DashboardMain  division={this.props.division} 
                    selectDivision={this.selectDivision} 
                    divisions={this.props.divisions} />
                break;
        
            default:
                break;
        }

        return (<div className="section-container">
            <ContentTitle title={"Admin Page"}
                description="management organisasi" />
            <div className="management-container">
                <Tab tabsData={buttonsData} />
                {content}
            </div>
        </div>)

    }

}
const mapStateToProps = state => {
    return {
        divisions: state.userState.divisions,
        division: state.userState.division,
    }
}

const mapDispatchToProps = dispatch => ({
    getDivisons: ( app) => dispatch(actions.getDivisons( app)),
    selectDivision: (divisionId, app) => dispatch(actions.selectDivision(divisionId, app))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)); 