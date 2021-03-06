import React, { Component } from 'react'
import '../../css/About.css'
import '../../css/Common.css'
import * as menus from '../../constant/Menus'
import InstantTable from '../layout/InstantTable'
import * as url from '../../constant/Url'
import '../../css/Common.css'
import ContentTitle from '../layout/ContentTitle' 

const logoUrl = url.baseImageUrl + "/res/img/asp.png";

class About extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        document.title = "About Us";
        this.props.setMenuCode(menus.ABOUT);
    }

    render() {
        return (
            <div className="section-container about-section  " >
                <ContentTitle title="About Us" />
                <div className=" abount-content" style={{
                    padding     : '5px',
                    width       : '90%',
                    fontFamily  : 'Consolas', margin: '5px'
                }}>
                    <InstantTable
                        rows={[
                            { values: ["Name", "Organization Management Admin"] },
                            { values: ["Version", "1.0.0"] },
                            { values: ["Description", "managing your organization activities effectively"] },


                        ]} />
                    <h2>Powered By</h2>
                    <img style={{ width: '50%' }} src={logoUrl} />
                </div></div>

        )
    }
}

export default About;