import React, { Component } from 'react'
import '../../css/Home.css'
import '../../css/Common.css'
import * as menus from '../../constant/Menus'
import ContentTitle from '../layout/ContentTitle';

const logoUrl = "http://localhost:50084/Asset/Images/mpi.png";

class Home extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = "Mahasiswa Pencinta Islam";
        this.props.setMenuCode(menus.HOME);
    }

    render() {
        return (
            <div className="section-container">
                <ContentTitle title="Welcome!" description=
                    {this.props.content} />
                <div className="article-content">
                    <h2 >Admin Console Mahasiswa Pencinta Islam</h2>
                    <img src={logoUrl} />
                </div>
            </div>
        );
    }
}

export default Home;