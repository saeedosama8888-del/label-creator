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
import { DEFAULT_CUBIC_COPY_CONFIG } from "../config/templateConfigService";

const USPS_Ground_Advantage_Cubic_Copy = ({ csvData, config: configProp }) => {
  // Use provided config or fall back to defaults
  const config = configProp || DEFAULT_CUBIC_COPY_CONFIG;

  // Helper to get fontFamily based on bold toggle
  const getFont = (bold) => (bold ? "Helvetica-Bold" : "Helvetica");

  // Build dynamic styles from config
  const styles = StyleSheet.create({
    logo: {
      textAlign: "center",
      fontSize: config.gLogo.fontSize,
      textTransform: "uppercase",
      fontFamily: getFont(config.gLogo.bold),
    },
    boldBanner: {
      fontSize: config.banner.fontSize,
      fontFamily: getFont(config.banner.bold),
      letterSpacing: 0.1,
    },
    tmText: {
      fontSize: config.banner.tmFontSize,
      fontFamily: getFont(config.banner.bold),
      marginLeft: 1.5,
      marginTop: 0.5,
      color: "black",
    },
    trackingHeader: {
      fontSize: config.trackingHeader.fontSize,
      fontFamily: getFont(config.trackingHeader.bold),
      textAlign: "center",
    },
    trackingNumber: {
      fontSize: config.trackingNumber.fontSize,
      fontFamily: getFont(config.trackingNumber.bold),
      paddingTop: 1.5,
      paddingBottom: 6,
      textAlign: "center",
    },
  });

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
            <Page size="A6" key={index} id={`content-id-${index}`} style={{ margin: 0, padding: 0 }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000",
                  borderWidth: 2.5,
                  width: "100%",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                  position: "relative",
                }}
              >
                {/* Top Header Row: G Logo, CUBIC, Postage Box */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                  }}
                >
                  <View
                    style={{
                      borderRightWidth: 1.1,
                      borderRightColor: "black",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "27%",
                      textAlign: "center",
                      paddingVertical: 5,
                      marginLeft: config.gLogo.offsetX,
                      marginTop: config.gLogo.offsetY,
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
                      paddingRight: config.cubicText?.marginRight !== undefined ? config.cubicText.marginRight : 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: config.cubicText?.fontSize || 9.5,
                        fontFamily: getFont(config.cubicText?.bold),
                        textTransform: "uppercase",
                        position: "relative",
                        left: config.cubicText?.offsetX || 0,
                        top: config.cubicText?.offsetY !== undefined ? config.cubicText.offsetY : -5,
                      }}
                    >
                      CUBIC
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingRight: config.postageBox?.marginRight !== undefined ? config.postageBox.marginRight : 16,
                      paddingVertical: 7,
                      marginLeft: config.postageBox.offsetX,
                      marginTop: config.postageBox.offsetY,
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1.1,
                        borderColor: "black",
                        padding: 2,
                        paddingHorizontal: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: config.postageBox.boxWidth,
                        textAlign: "center",
                        paddingTop: 5,
                        paddingBottom: 7,
                      }}
                    >
                      <Text style={{ fontSize: config.postageBox.fontSize, fontFamily: getFont(config.postageBox.bold), lineHeight: 1.15 }}>USPS GROUND</Text>
                      <Text style={{ fontSize: config.postageBox.fontSize, fontFamily: getFont(config.postageBox.bold), lineHeight: 1.15 }}>ADVANTAGE</Text>
                      <Text style={{ fontSize: config.postageBox.fontSize, fontFamily: getFont(config.postageBox.bold), lineHeight: 1.15 }}>U.S. POSTAGE PAID</Text>
                      <Text style={{ fontSize: config.postageBox.fontSize, fontFamily: getFont(config.postageBox.bold), lineHeight: 1.15 }}>ATFM</Text>
                      <Text style={{ fontSize: config.postageBox.fontSize, fontFamily: getFont(config.postageBox.bold), lineHeight: 1.15 }}>e-Postage</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 1.1,
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
                    paddingVertical: 5,
                    paddingBottom: 6,
                    textAlign: "center",
                    marginLeft: config.banner.offsetX,
                    marginTop: config.banner.offsetY,
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
                    paddingTop: 4,
                    paddingBottom: 2,
                    paddingLeft: 8,
                    paddingRight: 4,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      fontSize: config.senderAddress.fontSize,
                      fontFamily: getFont(config.senderAddress.bold),
                      textTransform: "uppercase",
                      lineHeight: 1.25,
                      marginLeft: config.senderAddress.offsetX,
                      marginTop: config.senderAddress.offsetY,
                    }}
                  >
                    <Text>{data[0]}</Text>
                    <Text>{data[2]}</Text>
                    <Text>{`${data[4]} ${data[5]} ${data[6]}`}</Text>
                  </View>
                  <View
                    style={{
                      fontSize: config.dateWeight.fontSize,
                      fontFamily: getFont(config.dateWeight.bold),
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      lineHeight: 1.25,
                      marginTop: config.dateWeight.offsetY,
                      marginRight: -config.dateWeight.offsetX,
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
                    gap: 10,
                    paddingLeft: 10,
                    paddingRight: 8,
                    marginTop: config.shipTo.marginTop + config.shipTo.offsetY,
                    marginLeft: config.shipTo.offsetX,
                  }}
                >
                  <View style={{ textTransform: "uppercase", lineHeight: 1.25 }}>
                    <Text style={{ fontSize: config.shipTo.labelFontSize, fontFamily: getFont(config.shipTo.bold), marginBottom: 4 }}>SHIP</Text>
                    <Text style={{ fontSize: config.shipTo.labelFontSize, fontFamily: getFont(config.shipTo.bold) }}>TO:</Text>
                  </View>
                  <View style={{ fontSize: config.shipTo.addressFontSize, fontFamily: getFont(config.shipTo.bold), color: "black", flex: 1, lineHeight: 1.25 }}>
                    <Text>{data[8]}</Text>
                    {data[9] && <Text style={{ textTransform: "uppercase" }}>{data[9]}</Text>}
                    <Text style={{ textTransform: "uppercase" }}>{data[10]}</Text>
                    {data[11] && <Text style={{ textTransform: "uppercase" }}>{data[11]}</Text>}
                    <Text style={{ textTransform: "uppercase" }}>{`${data[12]} ${data[13]} ${zipArea}`}</Text>
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
                      height: 3,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <View style={{ paddingVertical: 3, paddingTop: 3 }}>
                    <Text
                      style={{
                        ...styles.trackingHeader,
                        marginLeft: config.trackingHeader.offsetX,
                        marginTop: config.trackingHeader.offsetY,
                      }}
                    >
                      USPS TRACKING # EP
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        height: config.barcode.height,
                        width: config.barcode.width,
                        marginHorizontal: "auto",
                        paddingTop: 3,
                        paddingBottom: 0,
                        marginLeft: config.barcode.offsetX ? config.barcode.offsetX : undefined,
                        marginTop: config.barcode.offsetY || undefined,
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
                        ...styles.trackingNumber,
                        letterSpacing: 0.2,
                        marginLeft: config.trackingNumber.offsetX,
                        marginTop: config.trackingNumber.offsetY,
                      }}
                    >
                      {formattedValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 3,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <Text
                    style={{
                      fontSize: config.description.fontSize,
                      fontFamily: getFont(config.description.bold),
                      marginTop: config.description.marginTop + (config.description.offsetY || 0),
                      marginBottom: config.description.marginBottom,
                      paddingLeft: 1 + (config.description.offsetX || 0),
                      opacity: data[20] && String(data[20]).trim().length > 0 ? 1 : 0,
                    }}
                  >
                    {data[20] && String(data[20]).trim().length > 0 ? data[20] : " "}
                  </Text>
                </View>
              </View>
            </Page>
          );
        })}
    </Document>
  );
};

export default USPS_Ground_Advantage_Cubic_Copy;
