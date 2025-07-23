"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const LeftPanel = ({ setCoinsid, handleShow, setSymble }) => {
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
    <div className="fixed h-[100vh]">
      <div className="bg-[#2e303f] flex justify-between items-center">
        <div className="flex flex-row p-2 items-center  gap-4">
          <img src={getimg?.image} alt={getimg.name} className="w-9 h-9 mb-1" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-300">{getimg.name}</span>
            <span className="text-[16px] uppercase font-bold">
              {getimg.symbol} / {currency}
            </span>
          </div>
        </div>
        <div className="mr-2 md:hidden block">
          <button onClick={() => handleShow()}>
            <IoMdClose className="text-2xl" />
          </button>
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
            className="w-full p-3 rounded-md border-2 border-gray-800 "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="h-[100vh] overflow-y-auto scrollbar-hide">
        {filterCoin.map((res, id) => (
          <div
            key={id}
            className="flex justify-between hover:bg-gray-800 border-b-1 border-gray-800"
            onClick={() => {
              setCoinsid(res.id);
              SetGetimg(res);
              setSymble(res?.symbol);
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
                className={`p-2 rounded-md font-medium ${
                  res.price_change_percentage_24h > 0
                    ? "bg-green-900/50 text-green-400"
                    : "bg-rose-900/50 text-rose-400"
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
