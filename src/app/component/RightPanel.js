// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const RightPanel = ({ coinid = "bitcoin" }) => {
//   const [bids, setBids] = useState([]);
//   const [asks, setAsks] = useState([]);

//   // Simulated live order book updates
//   const fetchLiveOrderBook = async () => {
//     // Replace this with a real WebSocket or exchange API in production
//     const simulatedData = Array.from({ length: 20 }, () => {
//       const price = 1000 + Math.random() * 100; // Simulate BTC price
//       const volume = Math.random() * 2;
//       return [
//         Date.now(), // timestamp
//         parseFloat(price.toFixed(2)),
//         parseFloat(volume.toFixed(4)),
//       ];
//     });

//     const mid = Math.floor(simulatedData.length / 2);
//     const newBids = simulatedData.slice(0, mid).sort((a, b) => b[1] - a[1]);
//     const newAsks = simulatedData.slice(mid).sort((a, b) => a[1] - b[1]);

//     setBids(newBids);
//     setAsks(newAsks);
//   };

//   useEffect(() => {
//     fetchLiveOrderBook(); // Initial load
//     const interval = setInterval(fetchLiveOrderBook, 2000); // Refresh every 2s
//     return () => clearInterval(interval);
//   }, [coinid]);

//   return (
//     <div className="p-4 bg-gray-900 text-white rounded-lg space-y-6">
//       {/* Bids */}
//       <div>
//         <h2 className="text-green-400 font-bold mb-2">Bids (Buy Orders)</h2>
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-green-200">
//               <th className="text-left">Price (USD)</th>
//               <th className="text-left">Volume</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bids.map(([timestamp, price, volume], i) => (
//               <tr key={i} className="text-green-300">
//                 <td>{price}</td>
//                 <td>{volume}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Asks */}
//       <div>
//         <h2 className="text-red-400 font-bold mb-2">Asks (Sell Orders)</h2>
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-red-200">
//               <th className="text-left">Price (USD)</th>
//               <th className="text-left">Volume</th>
//             </tr>
//           </thead>
//           <tbody>
//             {asks.map(([timestamp, price, volume], i) => (
//               <tr key={i} className="text-red-300">
//                 <td>{price}</td>
//                 <td>{volume}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RightPanel;

"use client";
import React, { useEffect, useState } from "react";

const BINANCE_WS = "wss://stream.binance.com:9443/ws/trxusdt@depth10";
let btcfut1ws =
  "wss://dstream.binance.com/stream?streams=btcusd_220325@bookTicker";

const RightPanel = () => {
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
  }, []);
  console.log("asks", asks);
  return (
    <div className="grid grid-cols-1 gap-4 p-4 fixed">
      {/* Bids Table */}

      <div className="flex  gap-4 bg-[#161929] rounded-lg p-[13px]">
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
          <h2 className="text-xl font-semibold mb-2 text-green-600">
            Bids (Buy Orders)
          </h2>
          <table className="w-full text-sm border border-green-300">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-2 border-b border-green-300">Price (USDT)</th>
                <th className="p-2 border-b border-green-300">Amount (ETC)</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(([price, qty], index) => (
                <tr key={index} className="hover:bg-green-50 text-green-700">
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
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Asks (Sell Orders)
          </h2>
          <table className="w-full text-sm ">
            <thead>
              <tr className=" text-left">
                <th className="p-2">Price (USDT)</th>
                <th className="p-2">Amount (ETC)</th>
              </tr>
            </thead>
            <tbody>
              {asks.map(([price, qty], index) => (
                <tr key={index} className=" text-red-700">
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
