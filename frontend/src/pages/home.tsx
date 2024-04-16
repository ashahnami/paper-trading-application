import { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from "../common/navbar/index";
import "../assets/home.css";
import Watchlist from '../components/portfolio/portfolioWatchlist';

interface News {
  "category": string;
  "datetime": number;
  "headline": string;
  "id": number;
  "image": string;
  "related": string;
  "source": string;
  "summary": string;
  "url": string;
}

const Home = () => {
  const [news, setNews] = useState<News[]>();

  const fetchNews = async () => {
    const { data: news } = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    setNews(news);
  }

  useEffect(() => {
    document.title = "Home";
    fetchNews();
  }, [])

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        <div className="watchlist">
          <h5 className="header">Watchlist</h5>

          <Watchlist />
        </div>

        <div className="news">
          <h5>Recent News</h5>
          <table>
            <tbody>
              {news?.slice(0, 5).map((newsItem, index) => (
                <tr key={index} onClick={() => window.location.replace(newsItem.url)}>
                  <td className="image">
                    <img src={newsItem.image} width={200} />
                  </td>

                  <td className="headline">
                    <div>{newsItem.headline}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home
