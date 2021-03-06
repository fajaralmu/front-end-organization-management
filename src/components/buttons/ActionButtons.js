import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Input.css'
import '../../css/Button.css'
import * as stringUtil from '../../utils/StringUtil'

class ActionButtons extends Component {
    constructor(props) { super(props) }

    render() {
        let className = "action-button-wrapper";
        if(this.props.className){
            className += " "+this.props.className;
        }
        return (
            <div style={this.props.style ? this.props.style : {}} className={className}  >
                {this.props.buttonsData.map(buttonData => {
                    let className = "action-button rounded";
                    if (buttonData.status != null) {
                        className =
                            className.concat(" ").concat(buttonData.status).concat(" ").concat(buttonData.className);
                    }
                    return (
                        <button 
                        style       ={{...buttonData.style}} 
                        className   ={className} 
                        key         ={"btnKey-" + stringUtil.uniqueId()}
                        onClick     ={buttonData.onClick}>
                         {buttonData.text?buttonData.text:""}
                         </button>
                    )
                })}
            </div>);
    }
}

export default ActionButtons;