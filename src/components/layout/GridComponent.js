import React, { Component } from 'react'

class GridComponent extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let items = [];
        if (this.props.items) {
            items = this.props.items;
        }
        const width = this.props.width ? this.props.width : "auto ";
        const repeat = this.props.cols ? this.props.cols : items.length;
        const gridAutoColumns = width.repeat(repeat);


        return (
            <div style={{
                ...this.props.style,
                display: 'grid',
                verticalAlign: 'middle',
                gridTemplateColumns: gridAutoColumns,
                msGridColumns: gridAutoColumns,
            }} >
                {items.map(item => {
                    return item;
                })}
            </div>
        )
    }
}

export default GridComponent;