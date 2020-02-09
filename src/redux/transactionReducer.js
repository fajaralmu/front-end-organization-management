import * as types from './types'
import { nullLiteral } from '@babel/types';

export const initState = {
    productFlowStock: null,
    productFlowStocks: null,
    transactionData: null,
    successTransaction: false,
    customersData: null,
    productsData: null,
    cashflowInfoOut: null,
    cashflowInfoIn: null,
    cashflowDetail: null,
    productSalesData: null,
    productSalesDetails: null,
    transactionYears: [new Date().getFullYear(), new Date().getFullYear()]
};

export const reducer = (state = initState, action) => {

    //update trx year
    if (action != null && action.payload != null && action.payload.transactionYears != null) {
        state.transactionYears = action.payload.transactionYears;
    }

    switch (action.type) { 
        default:
            return { ...state };
    }
}

export default reducer;