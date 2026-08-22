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
    { src: "/Poppins/Poppins-Medium.ttf", fontWeight: 500 },
    { src: "/Poppins/Poppins-SemiBold.ttf", fontWeight: 600 },
    { src: "/Poppins/Poppins-Bold.ttf", fontWeight: 700 },
    { src: "/Poppins/Poppins-ExtraBold.ttf", fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  logo: {
    textAlign: "center",
    fontSize: 74,
    textTransform: "uppercase",
  },
});

const USPS_Priority_E_Postage_C1 = ({ csvData }) => {
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
      console.error("QR generation failed:", e);
      return null;
    }
  };

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

          const data14Parts = data[14]?.split("-");
          const firstPart = data14Parts[0];
          const data23 = data[23];
          const outputString = `^FNC1420${firstPart.toString().padStart(5, "0")}^FNC1${data23}`;
          const barcodeTwo = generateBarCodeTwoImage(outputString);

          let inputValue = data[23];
          let formattedValue = [
            inputValue?.slice(0, 4),
            inputValue?.slice(4, 8),
            inputValue?.slice(8, 12),
            inputValue?.slice(12, 16),
            inputValue?.slice(16, 20),
            inputValue?.slice(20, 24),
            inputValue?.slice(24),
          ].join(" ");

          let zipArea = data[14].toString().padStart(5, "0");

          const GS = String.fromCharCode(29);
          const qrcodeData = `]C1420${firstPart.toString().padStart(5, "0")}${GS}${data?.[23]}`;
          const qrcode = generateQrCode(qrcodeData);
          const randomNumber = Math.floor(Math.random() * 99);
          const randomNo = `C0${
            randomNumber < 10 ? `0${randomNumber}` : randomNumber
          }`;

          return (
            <Page size="A6" key={index} id={`content-id-${index}`}>
              <View
                style={{
                  padding: 6,
                  backgroundColor: "#fff",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#000",
                    borderWidth: 0.7,
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Top Section */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      borderBottomWidth: 1.2,
                      borderBottomColor: "#000",
                    }}
                  >
                    {/* Left P section */}
                    <View
                      style={{
                        width: "25%",
                        borderRightWidth: 1.2,
                        borderRightColor: "#000",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 74,
                          textTransform: "uppercase",
                        }}
                      >
                        P
                      </Text>
                    </View>

                    {/* Middle & Right section */}
                    <View
                      style={{
                        width: "75%",
                        display: "flex",
                        flexDirection: "row",
                        padding: 4,
                        paddingLeft: 8,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 7.5,
                              fontFamily: "Poppins",
                              fontWeight: 700,
                            }}
                          >
                            US POSTAGE AND FEES PAID
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              fontFamily: "Poppins",
                              fontWeight: 700,
                              marginTop: -1.2,
                            }}
                          >
                            PRIORITY MAIL
                          </Text>
                          <Text style={{ fontSize: 9, marginTop: 2 }}>
                            {dayjs().format("MMM D YYYY").toUpperCase()}
                          </Text>
                          <Text style={{ fontSize: 9, marginTop: 1 }}>
                            Mailed from ZIP {data[6]}
                          </Text>
                          <Text style={{ fontSize: 9, marginTop: 1 }}>
                            {data[16]} LB PM
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontSize: 8, marginTop: 4 }}>
                            CommercialPlusPrice
                          </Text>
                        </View>
                      </View>

                      {/* Right box */}
                      <View
                        style={{
                          width: 90,
                          borderWidth: 1.3,
                          borderColor: "#000",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 35,
                          marginTop: 10,
                          marginRight: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 6,
                            fontFamily: "Poppins",
                            fontWeight: 600,
                          }}
                        >
                          PRIORITY MAIL
                        </Text>
                        <Text
                          style={{
                            fontSize: 6,
                            fontFamily: "Poppins",
                            fontWeight: 600,
                          }}
                        >
                          U.S. POSTAGE PAID
                        </Text>
                        <Text
                          style={{
                            fontSize: 6,
                            fontFamily: "Poppins",
                            fontWeight: 600,
                          }}
                        >
                          ePostage
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* USPS PRIORITY MAIL Banner */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 2,
                      borderBottomWidth: 1.2,
                      borderBottomColor: "#000",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    >
                      USPS PRIORITY MAIL
                    </Text>
                  </View>

                  {/* Middle Address Section */}
                  <View style={{ padding: 6, flex: 1 }}>
                    {/* From Address */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={{ fontSize: 9, textTransform: "uppercase" }}
                        >
                          {data[0]}
                        </Text>
                        <Text
                          style={{ fontSize: 9, textTransform: "uppercase" }}
                        >
                          {data[2]}
                        </Text>
                        <Text
                          style={{ fontSize: 9, textTransform: "uppercase" }}
                        >
                          {`${data[4]} ${data[5]} ${data[6]}`}
                        </Text>
                      </View>
                      {/* The right side box with C494 (or something similar) */}
                      <View
                        style={{
                          borderWidth: 1.2,
                          borderColor: "#000",
                          padding: 3,
                          paddingHorizontal: 8,
                          alignSelf: "flex-start",
                          marginRight: 16,
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{randomNo}</Text>
                      </View>
                    </View>

                    {/* To Address & Barcode */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 25,
                        alignItems: "center",
                      }}
                    >
                      <View style={{ width: 25, height: 25, marginLeft: 6 }}>
                        {qrcode && (
                          <Image
                            src={qrcode}
                            style={{ height: "100%", width: "100%" }}
                          />
                        )}
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 9 }}>SHIP TO:</Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            marginTop: 2,
                            marginBottom: -3,
                          }}
                        >
                          {data[8]}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            marginBottom: -3,
                          }}
                        >
                          {data[10]}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            marginBottom: -3,
                          }}
                        >
                          {data[11]?.toUpperCase() ?? ""}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            marginBottom: -3,
                          }}
                        >
                          {`${data[12]} ${data[13]} ${zipArea}`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bottom Section */}
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
                        height: 3,
                        backgroundColor: "#000",
                      }}
                    ></View>
                    <View style={{ paddingVertical: 4, paddingTop: 6 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: "center",
                          fontFamily: "Helvetica-Bold",
                          fontWeight: 700,
                        }}
                      >
                        USPS TRACKING #
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          height: 70,
                          width: 230,
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
                          fontSize: 12,
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Helvetica-Bold",
                          fontWeight: 700,
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
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 3,
                        paddingHorizontal: 5,
                        paddingBottom: 2,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8,
                          marginTop: -12,
                        }}
                      >
                        {data?.[20]?.length > 0 ? data[20] : ""}
                      </Text>

                      <View style={{ width: 25, height: 25 }}>
                        {qrcode && (
                          <Image src={qrcode} style={{ height: "100%" }} />
                        )}
                      </View>
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

export default USPS_Priority_E_Postage_C1;
