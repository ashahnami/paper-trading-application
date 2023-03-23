import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import "../../assets/search.css";

const SearchBar = () => {
  const [input, setInput] = useState("")
  const [results, setResults] = useState([])
  const navigate = useNavigate()
  const [allStocks, setAllStocks] = useState([{displaySymbol: ""}])

  const handleChange = (e) => {
    setInput(e.target.value)
    if(e.target.value.length > 0 && allStocks.length > 0){
      const result = allStocks.filter((stock) => {
        return stock.displaySymbol.includes(e.target.value.toUpperCase());
      })
      setResults(result)
    } else {
      setResults([])
    }
  }

  const clearInput = () => {
    setInput("");
  }

  useEffect(() => {
    axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    .then(function(response){
      setAllStocks(response.data.filter((stock) => {return stock.type === "Common Stock"}))
    })
  }, [])

  return (
    <div className="search">
      <div className="input-container">
        <input 
          type="text" 
          value={input}
          onChange={handleChange} 
          placeholder="Search" 
        />
        
        <div className="search-icon">
          {input.length > 0 ? <ClearIcon onClick={clearInput}/> : <SearchIcon />}
        </div>

      </div>

      <div className="results">
        {results.slice(0, 5).map((stock, i) => {
          return (
            <div 
              className="result"
              key={i}
              onClick={(e) => {
                navigate(`/stock/${stock.displaySymbol}`)
              }}
              >
                <h4 style={{"fontWeight": "bold"}}>{stock.displaySymbol}</h4>
                <h6>{stock.description}</h6>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;