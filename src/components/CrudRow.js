import React, { Component } from 'react'
import ActionButtons from './buttons/ActionButtons';
import * as stringUtil from '../utils/StringUtil'

class CrudRow extends Component {
    constructor(props) {
        super(props);

        this.handleEdit = () => {
            if (this.props.handleEdit) {
                this.props.handleEdit(this.props.identifier);
            }
        }
        this.handleDelete = () => {
            if (this.props.handleEdit) {
                this.props.handleDelete(this.props.identifier);
            }
        }
    }

    render() {
        let values = this.props.values;
        const defaultRowColSpan = 1;
        if (null == values) {
            values = new Array();
        } else {
            let newValues = new Array();
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                if (this.props.CS || this.props.RS) {
                    let colspan = stringUtil.isNonNullArrayWithIndex(this.props.CS, i) ?
                        this.props.CS[i] : defaultRowColSpan;
                    let rowspan = stringUtil.isNonNullArrayWithIndex(this.props.RS, i) ?
                        this.props.RS[i] : defaultRowColSpan;
                    newValues.push({ value: value, colspan: colspan, rowspan: rowspan });
                } else
                    newValues.push({ value: value });
            }
            values = newValues;
        }

        let trStyle = this.props.style ? this.props.style : {
            borderTop: 'solid 1px gray',
        };
        let actionButton = <td style={trStyle}>
            <ActionButtons buttonsData={[
                {
                    id: "k-btn-edit-" + this.props.identifier,
                    status: 'warning',
                    onClick: this.handleEdit,
                    text: "Edit"
                },
                {
                    id: "k-btn-dlt-" + this.props.identifier,
                    status: 'danger',
                    onClick: this.handleDelete,
                    text: "Delete"
                }
            ]} />
        </td>;

        if (this.props.disabled == true) {
            actionButton = null;
            trStyle = this.props.style ? this.props.style : {};
        }
      
        return (
            <tr style={trStyle} key={stringUtil.uniqueId()}
                valign={this.props.valign}>
                <Cells values={values} trStyle={trStyle} />
                {actionButton}</tr>
        )
    }
}

const Cells = (props) => { 

    let values = props.values;

    return  values.map(value => { 
        
        return (
            <td key={ stringUtil.uniqueId()} id={ stringUtil.uniqueId()} 
                style={props.trStyle} rowSpan={value.rowspan} 
                colSpan={value.colspan}>
                {value.value}
            </td>
        )
    });
}

export default CrudRow;