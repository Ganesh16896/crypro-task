"use client";
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

const Panel = () => {
  const [coinsid, setCoinsid] = useState("bitcoin");

  console.log(coinsid);

  return (
    <div>
      <div className="grid grid-cols-6 gap-4 p-2">
        <div className=" col-span-1">
          <LeftPanel setCoinsid={setCoinsid} />
        </div>
        <div className=" col-span-4">
          <CenterPanel coinid={coinsid} />
        </div>
        <div className=" col-span-1">
          <RightPanel coinid={coinsid} />
        </div>
      </div>
    </div>
  );
};

export default Panel;
