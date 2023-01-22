import React, { useState } from 'react';
import httpClient from '../../httpClient';
import './style.css';

const StockBuy = (props) => {

    const [order, setOrder] = useState({
        ticker: "",
        price: "",
        quantity: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await httpClient.post('http://localhost:5000/buy', {
            ticker: order.ticker,
            price: order.price,
            quantity: order.quantity
        })
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    }

    return (
        <form onSubmit={handleSubmit}>

            <label>
                Stock: 
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, ticker: e.target.ticker}
                    })}
                />
            </label>

            <label>
                Quantity:
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, quantity: e.target.value}
                    })}
                />
            </label>

            <input type="submit" />

        </form>
    )
}

export default StockBuy;