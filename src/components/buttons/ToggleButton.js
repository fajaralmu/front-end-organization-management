import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Button.css'
import GridComponent from '../layout/GridComponent';
import { uniqueId } from '../../utils/StringUtil';

class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }

        this.onClick = (e) => {
            this.setState({active:!this.state.active})
            if(this.props.onClick){
                this.props.onClick(e);
            }
        }

    }
    render() {

        let outerClass = "toggle-outer";
        let innerClass = "toggle-inner";

        if(!this.props.active || this.props.active==false){
            outerClass+=" outer-inactive";
            innerClass+=" inner-inactive";
        }

        return (
            <div style={{fontSize:'13px'}}>
                <GridComponent items={[
                    <div key={uniqueId()} onClick={this.onClick} className={outerClass}>
                        <div  className={innerClass} ></div></div>,
                    <span  key={uniqueId()}>{this.props.text}</span>
                ]} />
            </div>
        )
    }
}

export default ToggleButton;