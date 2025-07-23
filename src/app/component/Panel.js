"use client";
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

const Panel = () => {
  const [coinsid, setCoinsid] = useState("bitcoin");
  const [show, setShow] = useState(true);
  console.log(coinsid);

  const handleShowhide = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  console.log(show);

  return (
    <div>
      <div className="grid grid-cols-6 gap-4 p-2 ">
        {show === false && (
          <div className=" col-span-1 w-[230px] z-20 lg:hidden block bg-gray-800 h-[100vh] ">
            <LeftPanel
              setCoinsid={setCoinsid}
              setShow={setShow}
              show={show}
              handleShow={handleShow}
            />
          </div>
        )}

        <div className=" col-span-1 hidden lg:block">
          <LeftPanel setCoinsid={setCoinsid} />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <CenterPanel coinid={coinsid} handleShow={handleShowhide} />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 md:col-span-6 lg:col-span-1">
          <RightPanel coinid={coinsid} />
        </div>
      </div>
    </div>
  );
};

export default Panel;
