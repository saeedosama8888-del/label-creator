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
import dayjs from "dayjs";

Font.register({
  family: "Poppins",
  fonts: [
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
  },
});

const USPS_Priority_Mail = ({ csvData }) => {
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
        csvData?.map((data, index) => {
          for (let i = 0; i < data?.length; i++) {
            if (!data[i]) {
              data[i] = "";
            }
          }

          const data14Parts = data[14]?.split("-"); // Splitting data[14] by dash
          const firstPart = data14Parts[0]; // Taking the first part before the dash
          const data23 = data[23]; // Taking data[23] as it is
          const outputString = `^FNC1420${firstPart.toString().padStart(5, "0")}^FNC1${data23}`;

          const barcodeTwo = generateBarCodeTwoImage(outputString);

          let inputValue = data[23];
          let formattedValue = [
            inputValue?.slice(0, 4), // Take the first four digits
            inputValue?.slice(4, 8), // Take the next four digits
            inputValue?.slice(8, 12), // Take the next four digits
            inputValue?.slice(12, 16), // Take the next four digits
            inputValue?.slice(16, 20), // Take the next four digits
            inputValue?.slice(20, 24), // Take the remaining digits
            inputValue?.slice(24), // Take the remaining digits
          ].join(" ");

          let zipArea = data[14].toString().padStart(5, "0");

          return (
            <Page size="A6" key={index} id={`content-id-${index}`}>
              <View>
                <View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderColor: "#000",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: -1.3,
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 1.2,
                          borderColor: "black",
                          borderBottomWidth: 0,
                          // borderLeftWidth: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "26%",
                          height: "95%",
                          textAlign: "center",
                          //   height: "50%",
                        }}
                      >
                        <Text style={styles.logo}>P</Text>
                      </View>
                      <View
                        style={{
                          borderWidth: 1.2,
                          borderColor: "black",
                          // borderRightWidth: 0,
                          padding: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          width: "28%",
                          textAlign: "center",
                          paddingBottom: 6,
                          paddingTop: 2,
                          marginRight: 16,
                          height: 60,
                        }}
                      >
                        <Text style={{ fontSize: 8.3 }}>PRIORITY MAIL</Text>
                        <Text style={{ fontSize: 8.3 }}>U.S. POSTAGE PAID</Text>
                        <Text style={{ fontSize: 8.3 }}>ATFM</Text>
                        <Text style={{ fontSize: 8.3 }}>e-Postage</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: -2.2,
                        width: "100%",
                        height: 1.2,
                        backgroundColor: "#000",
                      }}
                    ></View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 4,
                        paddingBottom: 5,
                        textAlign: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
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
                        paddingHorizontal: 6,
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          fontSize: "7px",
                          //   width: "50%",
                        }}
                      >
                        <Text style={{ textTransform: "uppercase" }}>{data[0]}</Text>
                        <Text style={{ textTransform: "uppercase" }}>{data[2]}</Text>
                        <Text
                          style={{ textTransform: "uppercase" }}
                        >{`${data[4]} ${data[5]} ${data[6]}`}</Text>
                      </View>
                      <View
                        style={{
                          fontSize: "7px",
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          marginTop: 3,
                        }}
                      >
                        <Text>{dayjs().format('MM/DD/YYYY')}</Text>
                        <Text>Mailed From {data[6]}</Text>
                        <Text>WT: {data[16]}.0000 LB</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        width: "100%",
                        textTransform: "uppercase",
                        gap: 8,
                        paddingHorizontal: 6,
                        marginTop: 40,
                      }}
                    >
                      <View style={{ width: "10%" }}>
                        <Text style={{ fontSize: "8px" }}>SHIP</Text>
                        <Text style={{ fontSize: "8px" }}>TO:</Text>
                      </View>
                      <View style={{ fontSize: "8.5px", color: "black" }}>
                        <Text>{data[8]}</Text>
                        {/* <Text>{data[9]}</Text> */}
                        {/* <Text>{data[15]}</Text> */}
                        <Text>
                          {data[10]}
                        </Text>
                        {data[11] && <Text>{data[11]}</Text>}
                        {/* {data[11] && <Text>{data[11]}</Text>} */}
                        <Text
                          style={styles.hager}
                        >{`${data[12]} ${data[13]} ${zipArea}`}</Text>

                        {/* {data[11] && <Text>{data[11]}</Text>} */}
                      </View>
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
                        <Text style={{ fontSize: 14, textAlign: "center" }}>
                          USPS TRACKING # EP
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            height: 66,
                            width: 250,
                            marginHorizontal: "auto",
                            paddingVertical: 8,
                          }}
                        >
                          {barcodeTwo && <Image src={barcodeTwo} />}
                        </View>
                        <Text
                          style={{
                            fontSize: "10px",
                            paddingTop: 3,
                            fontWeight: 100,
                            textAlign: "center",
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
                      {data[20] && data[20] !== "" && (
                        <Text
                          style={{
                            fontSize: "8px",
                            marginTop: 6,
                            marginBottom: 4,
                            paddingLeft: 1,
                          }}
                        >
                          DESC: {data[20]}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          );
        })}
    </Document>
  );
};

export default USPS_Priority_Mail;
