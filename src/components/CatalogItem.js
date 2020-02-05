import React, { Component } from 'react'

import '../css/Common.css'
import * as url from '../constant/Url'
import * as stringUtil from '../utils/StringUtil'
import InstantTable from './InstantTable'
import Label from './Label'
import Card from './Card'

class CatalogItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let product = this.props.product;

        //check if null
        if(!product || !product.category || !product.unit){
            return <h3>Please wait..</h3>
        }

        let productImageUrl = product.imageUrl;
        let imageUrl = url.baseImageUrl + productImageUrl.split("~")[0];
        let content = <div>
            <Label
                className="clickable " text={product.name}
                onClick={() => this.props.getProductDetail(product.code)}
            />
            <Label style={{ fontFamily: "Arial Narrow" , fontWeight:'bolder'}} text={stringUtil.beautifyNominal(product.price) + ",00"} />
            <span className="quantity-label">{stringUtil.beautifyNominal(product.count)}</span>{" "+product.unit.name}
            <Label text={product.category.name} />
        </div>
        return (
            <Card className="grid-item" icon={imageUrl} content={content} />
        )
    }
}

export default CatalogItem;