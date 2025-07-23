"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const LeftPanel = ({ setCoinsid }) => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [getimg, SetGetimg] = useState("");
  const [currency, SetCrrency] = useState("usd");
  const currencysyblem = ["usd", "inr", "eur"];

  const HandleCoinsList = async () => {
    try {
      const data = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      console.log("data", data);
      SetGetimg(data.data[0]);
      setCoins(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    HandleCoinsList();
  }, [currency]);

  const filterCoin = coins.filter(
    (res) =>
      res.name.toLowerCase().includes(search) ||
      res.symbol.toLowerCase().includes(search)
  );

  return (
    <div className="fixed">
      <div>
        <div className="flex flex-row p-2 items-center bg-[#2e303f] gap-4">
          <img src={getimg?.image} alt={getimg.name} className="w-9 h-9 mb-1" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-300">{getimg.name}</span>
            <span className="text-[16px] uppercase font-bold">
              {getimg.symbol} / {currency}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 bg-[#2e303f] mt-5">
        {currencysyblem.map((c, i) => (
          <button
            key={i}
            className={`p-2 border-b-4 uppercase  ${
              currency === c
                ? "border-amber-600 text-white font-semibold"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => SetCrrency(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div>
        <div className="border p-1 border-gray-900 ">
          <input
            label="Search For a Crypto Currency.."
            variant="outlined"
            placeholder="Search the coin  and Sumbol"
            className="w-full p-3 rounded-md "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="h-[532px] overflow-y-auto scrollbar-hide">
        {filterCoin.map((res) => (
          <div
            className="flex justify-between hover:bg-[#dbd5d5] border"
            onClick={() => {
              setCoinsid(res.id);
              SetGetimg(res);
            }}
          >
            <div className=" items-center gap-1 p-1">
              <p className="text-[14px] uppercase font-bold px-2">
                {`${res.symbol} / ${currency}`}
              </p>
              <p className="text-[10px] px-2 mt-1">
                {`${res.current_price.toFixed(2)} `}{" "}
                <span className="text-[12px] uppercase">{currency}</span>
              </p>
            </div>
            <div className="p-1">
              <p
                className={`p-2 font-medium ${
                  res.price_change_percentage_24h > 0
                    ? "bg-green-300"
                    : "bg-red-300"
                }`}
              >
                {res.price_change_percentage_24h > 0 && "+"}
                {res.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
