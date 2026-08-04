import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import bwipjs from "bwip-js";
import shippingZoneCalculator from "../utils/shippingZoneCalculator";
import { randomNumbers } from "../utils/randomNumbers";
import { PackingSlipPage } from "./PackingSlip";
import { convertControlPictures, groundAdvantageBarcodes } from "../utils/groundAdvantageBarcodes";


Font.register({
  family: "Poppins",
  fonts: [
    { src: "/Poppins/Poppins-Medium.ttf", fontWeight: 500 },
    { src: "/Poppins/Poppins-SemiBold.ttf", fontWeight: 600 },
    { src: "/Poppins/Poppins-Bold.ttf", fontWeight: 700 },
    { src: "/Poppins/Poppins-ExtraBold.ttf", fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  semiBoldText: { fontFamily: "Poppins", fontWeight: 600 },
  boldText: { fontWeight: 700, fontFamily: "Poppins" },
  underShipTo: {
    fontWeight: 800,
    fontFamily: "Poppins",
    fontSize: "9px",
    marginTop: -1,
    transform: "scaleY(1.2)",
    textTransform: "uppercase",
  },
  StretchBoldText: {
    fontSize: 16,
  },
  extraboldText: { fontWeight: 900, fontFamily: "Poppins" },
  barUpperText: {
    fontSize: 22,
    marginBottom: 4,
    zIndex: 10,
    marginTop: -2,
    marginRight: 10,
    textTransform: "uppercase",
  },
  normal: {
    fontSize: 12,
  },
  normalTwo: { fontSize: 11 },
  second: {
    fontWeight: 300,
    fontSize: 36,
    paddingRight: 18,
    marginTop: 2,
  },
  hager: {
    fontSize: "10px",
    textTransform: "uppercase",
  },
  logo: {
    textAlign: "center",
    fontSize: 74,
    textTransform: "uppercase",
    fontWeight: 900,
    fontFamily: "Helvetica-Bold",
  },
});

const USPS_Priority_Mail_2 = ({ csvData }) => {
  const getCurrentMonthYearFormatted = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const date = currentDate.getDate().toString().padStart(2, "0");
    return `${month}/${date}/${year}`;
  };

  const generateBarCodeTwoImage = (barcodeValueFour) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: barcodeValueFour,
        scale: 1,
        height: 10,
        includetext: false,
        textxalign: "center",
        parsefnc: true,
      });
      return canvas.toDataURL();
    } catch (e) {
      return null;
    }
  };

  const generatePdf147 = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: value,
        scale: 3,
        columns: 7,
        rows: 15,
        compact: false,
        includetext: false,
        padding: 0,
        encoding: "binary",
      });
      return canvas.toDataURL();
    } catch (e) {
      return null;
    }
  };

  const generateQrCode = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "datamatrix",
        text: value,
        scale: 4,
        includetext: false,
      });
      return canvas.toDataURL();
    } catch (e) {
      return null;
    }
  };

  const [dailyNumber, setDailyNumber] = useState(1);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastUpdated = localStorage.getItem("lastUpdated");
    if (!lastUpdated || lastUpdated !== today) {
      const num = localStorage.getItem("dailyNumber");
      const updatedNumber = num ? parseInt(num) + 1 : "038";
      setDailyNumber(updatedNumber);
      localStorage.setItem("dailyNumber", updatedNumber);
      localStorage.setItem("lastUpdated", today);
    } else {
      const num = localStorage.getItem("dailyNumber");
      setDailyNumber(parseInt(num));
    }
  }, []);

  return (
    <Document>
      {csvData &&
        csvData?.length >= 0 &&
        csvData?.flatMap((data, index) => {
          for (let i = 0; i < data?.length; i++) {
            if (!data[i]) {
              data[i] = "";
            }
          }

          // Calculate shipping zone dynamically
          const fromZipCode = data[6]; // From ZIP at index 6
          const toZipCode = data[14]; // To ZIP at index 14
          const calculatedZone = shippingZoneCalculator.calculateZone(
            fromZipCode,
            toZipCode
          );

          const data14Parts = data[14]?.split("-"); // Splitting data[14] by dash
          const firstPart = data14Parts[0]; // Taking the first part before the dash
          const data23 = data[23]; // Taking data[23] as it is

          const outputString = `^FNC1420${firstPart
            .toString()
            .padStart(5, "0")}^FNC1${data23}`;
          const barcodeTwo = generateBarCodeTwoImage(outputString);

          let inputValue = data[23];
          let formattedValue = [
            inputValue?.slice(0, 4), // Take the first four digits
            inputValue?.slice(4, 8), // Take the next four digits
            inputValue?.slice(8, 12), // Take the next four digits
            inputValue?.slice(12, 16), // Take the next four digits
            inputValue?.slice(16, 20), // Take the next four digits
            inputValue?.slice(20), // Take the remaining digits
          ].join(" ");

          let zipArea = data[14].toString().padStart(5, "0");

          const GS = String.fromCharCode(29);
          const qrcodeData = `${GS}420${firstPart
            .toString()
            .padStart(5, "0")}${GS}${data?.[23]}`;

          const rawBarcode = groundAdvantageBarcodes[index % groundAdvantageBarcodes.length];
          const convertedBarcode = convertControlPictures(rawBarcode);
          const pfd147Barcode = generatePdf147(convertedBarcode);
          const qrcode = generateQrCode(qrcodeData);

          return [
            <Page size="A6" key={`label-${index}`} id={`content-id-${index}`}>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000000",
                  borderWidth: 1,
                  height: "100%",
                  position: "relative",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30%",
                      height: "100%",
                      textAlign: "center",
                      borderRightWidth: 1,
                      borderRightColor: "black",
                    }}
                  >
                    <Text style={styles.logo}>P</Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 4,
                      width: "100%",
                      paddingBottom: 4,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingBottom: 2,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: 10,
                          }}
                        >
                          US POSTAGE & FEES PAID IMI
                        </Text>
                        <Text style={{ fontSize: 8 }}>
                          {data?.[16]} LB PRIORITY MAIL RATE
                        </Text>
                        <Text style={{ fontSize: 8 }}>
                          ZONE {calculatedZone}
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 3 }}>
                          Commercial
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <View
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            flexDirection: "row",
                          }}
                        >
                          <Image
                            src="https://res.cloudinary.com/ddi9ikzpq/image/upload/v1757371132/Screenshot_2025-09-07_at_4.40.27_AM_ci0jje.png"
                            style={{ width: 8, height: 8 }}
                          />
                          <Text
                            style={{
                              fontFamily: "Poppins",
                              fontWeight: 500,
                              fontSize: 8,
                            }}
                          >
                            Stamps.com
                          </Text>
                        </View>
                        <Text style={{ fontSize: 8 }}>
                          {
                            randomNumbers[
                              Math.floor(Math.random() * randomNumbers.length)
                            ]
                          }
                        </Text>
                        <Text style={{ fontSize: 8 }}>20587694</Text>
                        <Text style={{ fontSize: 8 }}>FROM {data?.[6]}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <View style={{ height: 35, width: 170 }}>
                        <Image src={pfd147Barcode} style={{ height: "100%" }} />
                      </View>
                      <Text style={{ fontSize: 8 }}>
                        {getCurrentMonthYearFormatted()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 1.2,
                    backgroundColor: "#000",
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 2,
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 600,
                      fontFamily: "Poppins",
                    }}
                  >
                    USPS PRIORITY MAIL
                  </Text>
                  <Text
                    style={{
                      width: 15,
                      height: 15,
                      textAlign: "center",
                      paddingTop: 2.5,
                      fontSize: 9,
                      marginLeft: 3,
                      color: "black",
                      border: "1.5px solid black",
                      borderRadius: 100,
                      marginTop: 6,
                    }}
                  >
                    R
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 1.2,
                    backgroundColor: "#000",
                  }}
                ></View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: 2,
                    paddingHorizontal: 8,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      fontSize: "11px",
                      //   width: "50%",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text>{data[0]}</Text>
                    <Text>{data[2]}</Text>
                    <Text>{`${data[4]} ${data[5]} ${data[6]}`}</Text>
                  </View>
                  <View style={{ textAlign: "right" }}>
                    <Text
                      style={{ fontFamily: "Helvetica-Bold", fontSize: "15px" }}
                    >
                      0001
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "100%",
                    textTransform: "uppercase",
                    marginTop: 16,
                    gap: 8,
                    paddingHorizontal: 6,
                  }}
                >
                  <View style={{ width: "10%" }}>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    >
                      SHIP
                    </Text>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        marginTop: -5,
                      }}
                    >
                      TO:
                    </Text>
                  </View>
                  <View style={{ fontSize: "12px", color: "black", flex: 1 }}>
                    <Text>{data[8]}</Text>
                    <Text>{data[9]}</Text>
                    {/* <Text>{data[15]}</Text> */}
                    <Text>{data[10]}</Text>
                    {data[11] && <Text>{data[11]}</Text>}
                    <Text>{`${data[12]} ${data[13]} ${zipArea}`}</Text>
                    {/* {data[11] && <Text>{data[11]}</Text>} */}
                  </View>
                </View>

                <View
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: data?.[11] ? -10 : -2,
                    marginLeft: 6,
                  }}
                >
                  <Image
                    src={qrcode}
                    style={{ height: "100%", width: "100%" }}
                  />
                </View>

                <View
                  style={{
                    position: "absolute",
                    bottom: 4,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 5,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <View style={{ paddingVertical: 4, paddingTop: 6 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                      }}
                    >
                      USPS TRACKING #
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        height: 66,
                        width: 250,
                        marginHorizontal: "auto",
                        paddingVertical: 7,
                      }}
                    >
                      {barcodeTwo && (
                        <Image
                          src={barcodeTwo}
                          style={{ height: "100%", width: "100%" }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: "13px",
                        textAlign: "center",
                        color: "black",
                        fontFamily: "Helvetica-Bold",
                      }}
                    >
                      {formattedValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 5,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 15,
                      paddingTop: 3,
                      paddingRight: 5,
                      paddingBottom: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8px",
                        marginTop: 4,
                      }}
                    >
                      {data?.[21]?.length > 0 ? data[21] : ""}
                    </Text>

                    <View style={{ width: 25, height: 25 }}>
                      <Image src={qrcode} style={{ height: "100%" }} />
                    </View>
                  </View>
                </View>
              </View>
            </Page>,
            <PackingSlipPage key={`slip-${index}`} data={data} index={index} />
          ];
        })}
    </Document>
  );
};

export default USPS_Priority_Mail_2;
