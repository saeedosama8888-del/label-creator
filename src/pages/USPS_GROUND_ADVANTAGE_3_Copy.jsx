import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import bwipjs from "bwip-js";

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

const USPS_Ground_Advantage_3_Copy = ({ csvData }) => {
  const WavyPostagePaid = () => {
    const generateWave = (y) => {
      const amplitude = 1.3;
      const frequency = 0.06;
      let path = `M0,${y}`;
      for (let x = 0; x <= 120; x += 10) {
        const offset = Math.sin(x * frequency) * amplitude;
        path += ` L${x},${y + offset}`;
      }
      return path;
    };

    const waveLines = Array.from({ length: 14 }, (_, i) =>
      generateWave(4 + i * 1.7)
    );

    return (
      <View
        style={{
          width: 120,
          height: 35,
          position: "relative",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <Svg
          width="120"
          height="35"
          viewBox="0 0 120 35"
          style={{ position: "absolute" }}
        >
          {waveLines.map((d, i) => (
            <Path key={i} d={d} stroke="black" strokeWidth="0.2" fill="none" />
          ))}
        </Svg>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "Helvetica-Bold",
            // letterSpacing: 1.2,
            lineHeight: 1,
            textAlign: "center",
            position: "absolute",
            top: 6.3,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          U.S. POSTAGE PAID
        </Text>

        <Text
          style={{
            fontSize: "5px",
            fontWeight: 400,
            fontFamily: "Helvetica",
            position: "absolute",
            top: 19.5,
            left: 8,
            right: 0,
            zIndex: 10,
            // letterSpacing: 0.3,
          }}
        >
          USPS Ship
        </Text>
      </View>
    );
  };
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
        csvData?.map((data, index) => {
          for (let i = 0; i < data?.length; i++) {
            if (!data[i]) {
              data[i] = "";
            }
          }

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

          const pfd147Barcode = generatePdf147(
            `[420]${firstPart.toString().padStart(5, "0")}[${data?.[23]?.slice(
              0,
              2
            )}]${data?.[23]?.slice(2)}`
          );
          const qrcode = generateQrCode(qrcodeData);
          const createdDate = getCurrentMonthYearFormatted();

          return (
            <Page size="A6" key={index} id={`content-id-${index}`}>
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
                    alignItems: "center",
                    gap: 20,
                    borderBottomWidth: 3,
                    borderBottomColor: "black",
                  }}
                >
                  <Image
                    src={
                      "https://res.cloudinary.com/ddi9ikzpq/image/upload/v1757379386/Screenshot_2025-09-09_at_5.51.43_AM_lvpw4e.png"
                    }
                    style={{ height: 25 }}
                  />

                  <Text
                    style={{ fontFamily: "Helvetica-Bold", fontSize: "18px" }}
                  >
                    USPS APIs
                  </Text>
                </View>
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
                    <Text style={styles.logo}>G</Text>
                  </View>
                  <View style={{ paddingHorizontal: 4, width: "100%" }}>
                    <Text style={{ fontStyle: "italic", fontSize: "8px" }}>
                      usps.com
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 14,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Helvetica-Bold",
                          fontSize: "7px",
                        }}
                      >
                        US POSTAGE
                      </Text>
                      <WavyPostagePaid />
                    </View>

                    <View
                      style={{
                        marginTop: 16,
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "8px",
                        }}
                      >
                        {data[16]} lbs 0 ozs
                      </Text>
                      <Text
                        style={{
                          fontSize: "8px",
                          marginLeft: 34,
                        }}
                      >
                        Mailed from {data?.[6]}
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
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "Poppins",
                    }}
                  >
                    USPS GROUND ADVANTAGE
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      marginLeft: 3,
                      marginTop: 3,
                      color: "black",
                      fontWeight: 600,
                      fontFamily: "Poppins",
                    }}
                  >
                    TM
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 1.1,
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
                    paddingRight: 8,
                    paddingLeft: 15,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      fontSize: "8px",
                      //   width: "50%",
                      textTransform: "uppercase",
                    }}
                  >
                    <Text>{data[0]}</Text>
                    <Text>{data[2]}</Text>
                    <Text>{`${data[4]} ${data[5]} ${data[6]}`}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text style={{ fontSize: "6.5px" }}>
                      Created {createdDate}
                    </Text>
                    <Text
                      style={{
                        fontSize: "11.5px",
                        marginTop: 4,
                        marginRight: 2,
                      }}
                    >
                      RDC 01
                    </Text>
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
                      fontSize: "10px",
                      color: "black",
                      flex: 1,
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      display: "flex",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ width: 33, height: 33, marginTop: 2 }}>
                      <Image
                        src={qrcode}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </View>

                    <View style={{ textTransform: "uppercase" }}>
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
                      width: "100%",
                      height: 3,
                      backgroundColor: "#000",
                    }}
                  ></View>
                  <View style={{ paddingVertical: 2, paddingTop: 2 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                        fontWeight: 500,
                      }}
                    >
                      USPS TRACKING # USPS Ship
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
                        fontSize: "11px",
                        textAlign: "center",
                        color: "black",
                        fontFamily: "Helvetica-Bold",
                        fontWeight: 500,
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
                      gap: 5,
                      paddingTop: 3,
                      paddingRight: 5,
                      paddingLeft: 10,
                      paddingBottom: 2,
                    }}
                  >
                    <Text style={{ fontSize: "8px" }}>
                      {data?.[20]?.length > 0 ? data[20] : ""}
                    </Text>

                    <View
                      style={{ width: 33, height: 33, alignSelf: "flex-end" }}
                    >
                      <Image src={qrcode} style={{ height: "100%" }} />
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

export default USPS_Ground_Advantage_3_Copy;
