export interface IOrderInfo {
    order_id : number;
    order_date : Date;
    total_amount : number;
    order_details : IOrderDetails[]
}

export interface IOrderDetails {
    product_id : number;
    product_name : string;
    quantity : number;
    amount : number;
}
