import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import httpClient from "../httpClient";
import Navbar from '../common/navbar/index';
import StockChart from '../components/chart/index.js';

import '../assets/stock.css';

const negativeStyle = {color: 'red'};
const positiveStyle = {color: 'green'};

const Stock = () => {
  
  const { ticker } = useParams();
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState({});
  const [order, setOrder] = useState({ price: 50, quantity: 1});
  const [orderType, setOrderType] = useState("Buy");
  const [balance, setBalance] = useState(0.00);
  const [positive, setPositive] = useState(true);
  const [stockInfo, setStockInfo] = useState({});

  const fetchBalance = async () => {
    const { data } = await httpClient.get("http://localhost:5000/balance");
    setBalance(data.balance);
  }

  const fetchQuote = async () => {
    const { data } = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    setPrice(data.c.toFixed(2));
    setDetails(data);

    if(data.d < 0){
      setPositive(false);
    }
  }

  const fetchStockInfo = async () => {
    const { data } = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    setStockInfo(data);
  }
  
  useEffect(() => {
    
    fetchQuote();
    let interval = setInterval(async () => { fetchQuote() }, 4000)
    
    fetchStockInfo();
    fetchBalance()
    
    return () => {clearInterval(interval)}
  }, [ticker])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    const latestPrice = data.c

    httpClient.post('http://localhost:5000/buy', {
      ticker: ticker,
      price: latestPrice,
      quantity: order.quantity 
    })
    .then(function(response){
        console.log(response);
        fetchBalance()
    })
  }

  return (
    <div className="stock">
      <Navbar />

      <div className="stock-header">
        <div className="info">
          <h3>{ticker}</h3>
          <div>{stockInfo.name.toUpperCase()}</div>
          <div>{stockInfo.exchange.toUpperCase()}</div>
        </div>

        <div className="price">${price}</div>
        <div className="change" style={positive ? positiveStyle : negativeStyle}>{(positive ? "+" : "" ) + details.d} ({(positive ? "+" : "") + parseFloat(details.dp).toFixed(2)}%) <span>Today</span></div>
      </div>

      <div className="stock-container">
        <div className="col1">

          <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>

          <div className="stock-details">
            <div className="stock-details-col">
              <div className="row">
                <div>Open</div>
                <div>{parseFloat(details.o).toFixed(2)}</div>
              </div>

              <div className="row">
                <div>Previous close</div>
                <div>{parseFloat(details.pc).toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>High</div>
                <div>{parseFloat(details.h).toFixed(2)}</div>
              </div>
              <div className="row">
                <div>Low</div>
                <div>{parseFloat(details.l).toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>Change percent</div>
                <div>{parseFloat(details.dp).toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* <div className="stock-description">
            <h2>About {ticker}</h2>
            {description}
          </div> */}

        </div>

      <div className="col2">
          <div className="stock-buy">
            <form onSubmit={handleSubmit}>
                <h3>Buy {ticker}</h3>

                <div className="quantity">
                  <div>Shares</div>

                  <input
                      type="number"
                      defaultValue={1}
                      min="1"
                      onChange={(e) => setOrder(previousState => {
                          return { ...previousState, quantity: e.target.value}
                      })}
                      required
                  />
                </div>

                <div className="price">
                  <div>Market price</div>
                  <div>${price}</div>
                </div>

                <div className="cost">
                  <div>Estimated cost</div>
                  <div>${(price * order.quantity).toFixed(2)}</div>
                </div>

                <input type="submit" value={orderType} />

                {/* { isLoading ? "Loading balance" :
                  <div className="balance">${balance.toFixed(2)} available</div>
                } */}
                <div className="balance">${balance.toFixed(2)} available</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;