import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Input.css'
import { _byId } from '../../utils/ComponentUtil'
import * as stringUtil from '../../utils/StringUtil'

class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.handleOnChange = (e) => {
            if (this.props.onChange) {
                this.props.onChange(e.target.value); 
            }
            else {
                console.log("Not supported");
            }
        }

    }

    componentDidMount() {
        if (this.props.value) {
            _byId(this.props.id).value = this.props.value;
        }
    }

    render() {
        let options = [];
        if (this.props.options) {
            options = this.props.options;
        } 
        return (
            <div className="input-field ">
                <select value={this.props.defaultValue ? this.props.defaultValue : ""} className="rounded" id={this.props.id}
                    onChange={this.handleOnChange} >
                    {options.map(
                        option => {
                            return <option key={"opt_" + stringUtil.uniqueId()} value={option.value} >{option.text}</option>
                        }
                    )}
                </select>
            </div>
        )
    }
}

export default ComboBox;