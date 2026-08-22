import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Ups_Second_Day from "./Ups_Second_Day";
import Ups_Second_Day_2 from "./Ups_Second_Day_2";
import Ups_Next_Day_Air from "./Ups_Next_Day_Air";
import Ups_Next_Day_Air_2 from "./Ups_Next_Day_Air_2";
import Ups_Ground from "./Ups_Ground";
import Ups_Ground_2 from "./Ups_Ground_2";
import Ups_Ground_3 from "./Ups_Ground_3";
import USPS_Ground_Advantage from "./USPS_GROUND_ADVANTAGE";
import USPS_Priority_Mail from "./Ups_Priority_Mail";
import Wallmart_USPS_Ground_Advantage from "./Wallmart_USPS_Ground_Advantage";
import Wallmart_USPS_Priority_Mail from "./Wallmart_USPS_Priority_Mail";
import USPS_Ground_Advantage_2 from "./USPS_GROUND_ADVANTAGE_2";
import USPS_Priority_Mail_2 from "./USPS_Priority_Mail_2";
import USPS_Priority_Mail_3 from "./USPS_Priority_Mail_3";
import USPS_Ground_Advantage_3 from "./USPS_GROUND_ADVANTAGE_3";
import USPS_Ground_Pitney_Bowes from "./USPS_Ground_Pitney_Bowes";
import USPS_Priority_Pitney_Bowes from "./USPS_Priority_Pitney_Bowes";
import FedEx from "./FedEx";
import USPS_Ground_Advantage_ClickNShip from "./USPS_Ground_Advantage_ClickNShip";
import USPS_Priority_Mail_2_Copy from "./USPS_Priority_Mail_2_Copy";
import USPS_Ground_Advantage_2_Copy from "./USPS_Ground_Advantage_2_Copy";
import PackingSlip from "./PackingSlip";
import USPS_Priority_Mail_3_Copy from "./USPS_Priority_Mail_3_Copy";
import USPS_Priority_E_Postage_C1 from "./USPS_Priority_E_Postage_C1";
import Wallmart_USPS_Priority_Mail_Copy from "./Wallmart_USPS_Priority_Mail_Copy";
import Wallmart_USPS_Ground_Advantage_Copy from "./Wallmart_USPS_Ground_Advantage_Copy";
import USPS_Ground_Advantage_3_Copy from "./USPS_GROUND_ADVANTAGE_3_Copy";
import USPS_Api_Priority_Mail from "./USPS_Api_Priority_Mail";
import USPS_Api_Priority_Mail_C1 from "./USPS_Api_Priority_Mail_C1";
import USPS_Ground_Advantage_Copy from "./USPS_GROUND_ADVANTAGE_Copy";
import USPS_Ground_Advantage_Cubic from "./USPS_Ground_Advantage_Cubic";
import USPS_SCAN_Form_5630 from "./USPS_SCAN_Form_5630";


const getSelectedDocument = (selectedOption, csvData) => {
  switch (selectedOption) {
    case "USPS SCAN Form 5630":
      return <USPS_SCAN_Form_5630 csvData={csvData} />;
    case "UPS 2ND DAY AIR":
      return <Ups_Second_Day csvData={csvData} />;
    case "UPS 2ND DAY AIR 2":
      return <Ups_Second_Day_2 csvData={csvData} />;
    case "UPS NEXT DAY AIR 2":
      return <Ups_Next_Day_Air_2 csvData={csvData} />;
    case "UPS NEXT DAY AIR":
      return <Ups_Next_Day_Air csvData={csvData} />;
    case "UPS Ground":
      return <Ups_Ground csvData={csvData} />;
    case "UPS Ground 2":
      return <Ups_Ground_2 csvData={csvData} />;
    case "UPS Ground 3":
      return <Ups_Ground_3 csvData={csvData} />;
    case "USPS Ground Advantage":
      return <USPS_Ground_Advantage csvData={csvData} />;
    case "USPS Ground Advantage Copy":
      return <USPS_Ground_Advantage_Copy csvData={csvData} />;
    case "USPS Ground Advantage Cubic":
    case "Cubic":
      return <USPS_Ground_Advantage_Cubic csvData={csvData} />;
    case "USPS Ground Advantage 2":
      return <USPS_Ground_Advantage_2 csvData={csvData} />;
    case "USPS Ground Advantage 2 Copy":
      return <USPS_Ground_Advantage_2_Copy csvData={csvData} />;
    case "USPS Ground Advantage 3":
      return <USPS_Ground_Advantage_3 csvData={csvData} />;
    case "USPS Ground Advantage 3 Copy":
      return <USPS_Ground_Advantage_3_Copy csvData={csvData} />;
    case "USPS api priority mail":
      return <USPS_Api_Priority_Mail csvData={csvData} />;
    case "USPS api priority mail C1":
      return <USPS_Api_Priority_Mail_C1 csvData={csvData} />;
    case "Click n ship ground":
      return <USPS_Ground_Advantage_ClickNShip csvData={csvData} />;
    case "Wallmart USPS Ground Advantage":
      return <Wallmart_USPS_Ground_Advantage csvData={csvData} />;
    case "Wallmart USPS Ground Advantage Copy":
      return <Wallmart_USPS_Ground_Advantage_Copy csvData={csvData} />;
    case "Wallmart USPS Priority Mail":
      return <Wallmart_USPS_Priority_Mail csvData={csvData} />;
    case "Wallmart USPS Priority Mail Copy":
      return <Wallmart_USPS_Priority_Mail_Copy csvData={csvData} />;
    case "USPS Priority Mail":
      return <USPS_Priority_Mail csvData={csvData} />;
    case "USPS Priority Mail 2":
      return <USPS_Priority_Mail_2 csvData={csvData} />;
    case "USPS Priority Mail 2 Copy":
      return <USPS_Priority_Mail_2_Copy csvData={csvData} />;
    case "USPS Priority Mail 3 e Postage":
      return <USPS_Priority_Mail_3 csvData={csvData} />;
    case "USPS Priority Mail 3 e Postage Copy":
      return <USPS_Priority_Mail_3_Copy csvData={csvData} />;
    case "USPS Priority e postage C1":
      return <USPS_Priority_E_Postage_C1 csvData={csvData} />;
    case "USPS Ground Pitney Bowes":
      return <USPS_Ground_Pitney_Bowes csvData={csvData} />;
    case "USPS Priority Pitney Bowes":
      return <USPS_Priority_Pitney_Bowes csvData={csvData} />;
    case "FedEx":
      return <FedEx csvData={csvData} />;
    case "Packing Slip":
      return <PackingSlip csvData={csvData} />;

    default:
      return <Ups_Second_Day csvData={csvData} />;
  }
};

const MainDocument = ({ csvData, cvsFileName, selectedOption }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => {
      setReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [csvData, selectedOption]);

  const uniqueKey = `${selectedOption}-${csvData?.length}-${cvsFileName}`;

  return (
    <div key={uniqueKey}>
      <div className="w-full sm:w-[16%] lg:ml-[10.8%] md:ml-[7%] sm:ml-0 ml-0 px-4 sm:px-0 mb-4">
        {ready && (
          <PDFDownloadLink
            className="bg-blue-600 hover:bg-blue-700 mx-auto text-white transition-all rounded-lg sm:w-[100%] w-full flex  justify-center py-2 mb-4 "
            document={getSelectedDocument(selectedOption, csvData)}
            fileName={`${cvsFileName}.pdf`}
          >
            {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
          </PDFDownloadLink>
        )}
      </div>
      <PDFViewer style={{ width: "100%", height: 1200, margin: "auto" }}>
        {getSelectedDocument(selectedOption, csvData)}
      </PDFViewer>
    </div>
  );
};

export default MainDocument;
