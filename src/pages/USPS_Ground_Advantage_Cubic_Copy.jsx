import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import bwipjs from "bwip-js";

const styles = StyleSheet.create({
  logo: {
    textAlign: "center",
    fontSize: 74,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  boldBanner: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  tmText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginLeft: 3,
    marginTop: 2,
    color: "black",
  },
  trackingHeader: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  trackingNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    paddingTop: 3,
    textAlign: "center",
  },
});

const USPS_Ground_Advantage_Cubic_Copy = ({ csvData }) => {
  const getCurrentMonthYearFormatted = (dataRow) => {
    if (dataRow) {
      const dateRegex = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/;
      const values = Array.isArray(dataRow) ? dataRow : Object.values(dataRow);
      for (let i = 0; i < values.length; i++) {
        const val = String(values[i] || "").trim();
        if (val && dateRegex.test(val)) {
          return val;
        }
      }
    }
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
        height: 11,
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
          if (!data) return null;

          for (let i = 0; i < 25; i++) {
            if (!data[i]) {
              data[i] = "";
            }
          }

          const data14Parts = data[14] ? String(data[14]).split("-") : [""];
          const firstPart = data14Parts[0] || "";
          const data23 = data[23] || "";
          const outputString = `^FNC1420${firstPart
            .toString()
            .padStart(5, "0")}^FNC1${data23}`;
          const barcodeTwo = generateBarCodeTwoImage(outputString);

          let inputValue = data[23] || "";
          let formattedValue = [
            inputValue?.slice(0, 4),
            inputValue?.slice(4, 8),
            inputValue?.slice(8, 12),
            inputValue?.slice(12, 16),
            inputValue?.slice(16, 20),
            inputValue?.slice(20),
          ].join(" ");

          let zipArea = data[14] ? data[14].toString().padStart(5, "0") : "00000";

          return (
            <Page
              size="A6"
              key={index}
              id={`content-id-${index}`}
              style={{ padding: 4, backgroundColor: "#fff" }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000",
                  borderWidth: 3,
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Top Header Row: G Logo, CUBIC, Postage Box */}
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
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "26%",
                      height: "95%",
                      textAlign: "center",
                    }}
                  >
                    <Text style={styles.logo}>G</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingRight: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      CUBIC
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1.5,
                      borderColor: "black",
                      padding: 2,
                      paddingHorizontal: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36%",
                      textAlign: "center",
                      paddingTop: 6,
                      paddingBottom: 8,
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ fontSize: 8.5 }}>USPS GROUND</Text>
                    <Text style={{ fontSize: 8.5 }}>ADVANTAGE</Text>
                    <Text style={{ fontSize: 8.5 }}>U.S. POSTAGE PAID</Text>
                    <Text style={{ fontSize: 8.5 }}>ATFM</Text>
                    <Text style={{ fontSize: 8.5 }}>e-Postage</Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 1.2,
                    backgroundColor: "#000",
                  }}
                ></View>

                {/* USPS GROUND ADVANTAGE Banner */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingVertical: 4,
                    paddingBottom: 6,
                    textAlign: "center",
                  }}
                >
                  <Text style={styles.boldBanner}>
                    USPS GROUND ADVANTAGE
                  </Text>
                  <Text style={styles.tmText}>
                    TM
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 1.2,
                    backgroundColor: "#000",
                  }}
                ></View>

                {/* Sender and Date / Weight */}
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
                      fontSize: "8.8px",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text>{data[0]}</Text>
                    <Text>{data[2]}</Text>
                    <Text>{`${data[4]} ${data[5]} ${data[6]}`}</Text>
                  </View>
                  <View
                    style={{
                      fontSize: "8px",
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    <Text>{getCurrentMonthYearFormatted(data)}</Text>
                    <Text>Mailed From {data[6]}</Text>
                    <Text>{data[16] ? `WT:${data[16]} lb` : "WT:2 lb"}</Text>
                  </View>
                </View>

                {/* SHIP TO section */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "100%",
                    textTransform: "uppercase",
                    gap: 10,
                    paddingHorizontal: 8,
                    marginTop: 22,
                  }}
                >
                  <View style={{ width: "12%" }}>
                    <Text style={{ fontSize: "9.5px" }}>SHIP</Text>
                    <Text style={{ fontSize: "9.5px" }}>TO:</Text>
                  </View>
                  <View style={{ fontSize: "10px", color: "black", flex: 1 }}>
                    <Text>{data[8]}</Text>
                    {data[9] && <Text>{data[9]}</Text>}
                    <Text>{data[10]}</Text>
                    {data[11] && <Text>{data[11]}</Text>}
                    <Text>{`${data[12]} ${data[13]} ${zipArea}`}</Text>
                  </View>
                </View>

                {/* Bottom Tracking Barcode & Description */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 4,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <View style={{ paddingVertical: 3, paddingTop: 3 }}>
                    <Text style={styles.trackingHeader}>
                      USPS TRACKING # EP
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        height: 68,
                        width: 250,
                        marginHorizontal: "auto",
                        paddingVertical: 3,
                      }}
                    >
                      {barcodeTwo && (
                        <Image
                          src={barcodeTwo}
                          style={{ height: "100%", width: "100%" }}
                        />
                      )}
                    </View>
                    <Text style={styles.trackingNumber}>
                      {formattedValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 4,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  {data[20] && data[20].length && (
                    <Text
                      style={{
                        fontSize: "9px",
                        fontFamily: "Helvetica-Bold",
                        marginTop: 14,
                        marginBottom: 24,
                        paddingLeft: 6,
                      }}
                    >
                      {data[20]}
                    </Text>
                  )}
                </View>
              </View>
            </Page>
          );
        })}
    </Document>
  );
};

export default USPS_Ground_Advantage_Cubic_Copy;
