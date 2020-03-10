import React, { Component } from 'react'
import { uniqueId } from '../../utils/StringUtil';

class GridComponent extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let items = [];
        if (this.props.items) {
            items = this.props.items;
        }
        const width             = this.props.width ? this.props.width : "auto ";
        const repeat            = this.props.cols ? this.props.cols : items.length;
        const gridAutoColumns   = width.repeat(repeat);
        const msGridAutoColumns = width == "auto"? "1fr".repeat(repeat) : width.repeat(repeat);

        let gridColumn = 1;
        let gridRow    = 1;

        return (
            <div className="grid-container" style={{
                ...this.props.style,
               // display: 'grid',  stated in css
//display: '-ms-grid',
                verticalAlign       : 'middle',
                gridTemplateColumns : gridAutoColumns,
                msGridColumns       : msGridAutoColumns, 
            }} >
                {items.map(item => {

                    let style = {
                        msGridColumn: gridColumn,
                        msGridRow   : gridRow
                    }

                    gridColumn++;

                    if(gridColumn > repeat){
                        gridColumn = 1;
                        gridRow++;
                    }  

                    return <div key={uniqueId()} style={style}>{item}</div>;
                })}
            </div>
        )
    }
}

export default GridComponent;