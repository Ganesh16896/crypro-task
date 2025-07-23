"use client";
import React, { useEffect, useState } from "react";

let btcfut1ws =
  "wss://dstream.binance.com/stream?streams=btcusd_220325@bookTicker";

const RightPanel = ({ symble }) => {
  const BINANCE_WS = `wss://stream.binance.com:9443/ws/${symble}usdt@depth20`;
  const [tabs, setTabs] = useState("Asks");
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS);
    const tws = new WebSocket(btcfut1ws);
    console.log("twe", ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.bids && data.asks) {
        setBids(data.bids);
        setAsks(data.asks);
      }
    };

    return () => {
      ws.close();
    };
  }, [symble]);
  console.log("asks", asks);
  return (
    <div className="grid grid-cols-1 gap-4 p-0 w-[250px] fixed">
      {/* Bids Table */}

      <div className="flex justify-around  w-[100%] gap-4 bg-[#161929] rounded-lg p-[13px]">
        <button
          className={`font-medium hover:border-b-2 hover:border-orange-700 hover:text-orange-700 ${
            tabs === "Asks"
              ? "text-orange-700 border-b-2 border-orange-700"
              : ""
          }`}
          onClick={() => setTabs("Asks")}
        >
          Asks
        </button>
        <button
          onClick={() => setTabs("Bids")}
          className={`font-medium hover:border-b-2 hover:border-orange-700 hover:text-orange-700 ${
            tabs === "Bids"
              ? "text-orange-700 border-b-2 border-orange-700"
              : ""
          }`}
        >
          Bids
        </button>
      </div>
      {tabs === "Bids" ? (
        <div>
          <table className="w-full text-sm ">
            <thead>
              <tr className="text-center">
                <th className="p-2 ">Price (USDT)</th>
                <th className="p-2 uppercase">qty (${symble})</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(([price, qty], index) => (
                <tr key={index} className=" text-green-700 text-center ">
                  <td className="p-2">{parseFloat(price).toFixed(2)}</td>
                  <td className="p-2">{parseFloat(qty).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {/* Asks Tabbs */}

          <table className="w-full text-sm  text-center">
            <thead>
              <tr className=" text-center">
                <th className="p-2">Price (USDT)</th>
                <th className="p-2 uppercase">qty (${symble})</th>
              </tr>
            </thead>
            <tbody>
              {asks.map(([price, qty], index) => (
                <tr key={index} className=" text-red-700 text-center">
                  <td className="p-2">{parseFloat(price).toFixed(2)}</td>
                  <td className="p-2">{parseFloat(qty).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
