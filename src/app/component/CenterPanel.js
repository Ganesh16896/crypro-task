"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { FaBars } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  CandlestickController,
  CandlestickElement
);

const CenterPanel = ({ coinid, handleShow }) => {
  const chartDays = [
    // { label: "1h", value: 1 / 24 },
    { label: "24H", value: 1 },
    { label: "30D", value: 30 },
    { label: "3M", value: 90 },
    { label: "1Y", value: 365 },
  ];

  const [days, setDays] = useState(1);
  const [historicData, setHistoricData] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);

  const [changes, setChange] = useState();
  const [high, setHigh] = useState();
  const [low, setLow] = useState();
  const [volume, setVolume] = useState();

  // const currency = "USD";

  const HandleCoinData = async () => {
    try {
      const data = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinid}`
      );
      console.log("dd", data.data.market_data);
      setChange(data.data.market_data.ath_change_percentage["usd"].toFixed(2));
      setHigh(data.data.market_data.high_24h["usd"]);
      setLow(data.data.market_data.low_24h["usd"]);
      setVolume(data.data.market_data.total_volume["usd"]);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(changes);

  const fetchHistoricData = async () => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart?vs_currency=usd&days=${days}`
      );
      // console.log("grap", res);
      setHistoricData(res.data.prices);
      setOhlcData(generateOHLC(res.data.prices));
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    if (coinid) {
      fetchHistoricData();
      HandleCoinData();
    }
  }, [coinid, days]);

  const generateOHLC = (prices) => {
    const interval = 5; // Adjust granularity
    const result = [];
    for (let i = 0; i < prices.length - interval; i += interval) {
      const chunk = prices.slice(i, i + interval);
      const time = chunk[0][0];
      const open = chunk[0][1];
      const close = chunk[chunk.length - 1][1];
      const highs = chunk.map((c) => c[1]);
      const lows = chunk.map((c) => c[1]);
      result.push({
        x: time,
        o: open,
        h: Math.max(...highs),
        l: Math.min(...lows),
        c: close,
      });
    }
    return result;
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "MMM d, h:mm a",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { o, h, l, c } = context.raw;
            return `O: ${o}, H: ${h}, L: ${l}, C: ${c}`;
          },
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Candlestick",
        data: ohlcData,
        borderColor: "#EEBC1D",
        color: {
          up: "#0f0",
          down: "#f00",
          unchanged: "#999",
        },
      },
    ],
  };

  return (
    <div className="">
      <div className="flex justify-between flex-wrap gap-0 bg-[#161929] rounded-lg p-[13px]">
        <div className="flex gap-5">
          <div className="mr-2 md:hidden block">
            <button onClick={() => handleShow()}>
              <FaBars className="text-2xl" />
            </button>
          </div>
          <div>
            <p className="text-[10px] text-gray-500">24h change</p>
            <p
              className={` font-medium text-[13px] text-gray-500 ${
                changes > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {changes > 0 ? `+${changes}` : changes}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500">24h High</p>
            <p className="text-[13px] text-gray-300">{formatNumber(high)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500">24h low</p>
            <p className="text-[13px] text-gray-300">{formatNumber(low)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500">24h volume</p>
            <p className="text-[13px] text-gray-300">{formatNumber(volume)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {chartDays.map((day) => (
            <button
              key={day.value}
              onClick={() => setDays(day.value)}
              className={` p-1   ${
                day.value === days
                  ? "text-[#3261e3] border-b-2  font-bold"
                  : "bg-transparent text-white border-[#3261e3] hover:border-b-2 hover:text-[#3261e3]"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      <div className="">
        <Chart type="candlestick" data={data} options={options} />
      </div>
    </div>
  );
};

export default CenterPanel;

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};
