import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import bwipjs from "bwip-js";
import shippingZoneCalculator from "../utils/shippingZoneCalculator";
import { PackingSlipPage } from "./PackingSlip";
import { convertControlPictures, groundAdvantageBarcodes } from "../utils/groundAdvantageBarcodes";



Font.register({
  family: "Oswald",
  fonts: [
    { src: "/Oswald/Oswald-Regular.ttf", fontWeight: 500 },
    { src: "/Oswald/Oswald-Medium.ttf", fontWeight: 600 },
    { src: "/Oswald/Oswald-SemiBold.ttf", fontWeight: 700 },
    { src: "/Oswald/Oswald-Bold.ttf", fontWeight: 800 },
  ],
});

Font.register({
  family: "Poppins",
  fonts: [
    { src: "/Poppins/Poppins-SemiBold.ttf", fontWeight: 600 },
    { src: "/Poppins/Poppins-Bold.ttf", fontWeight: 700 },
    { src: "/Poppins/Poppins-ExtraBold.ttf", fontWeight: 900 },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  topRow: {
    flexDirection: "row",
    width: "100%",
  },
  flexRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bigG: {
    fontSize: 65,
    fontWeight: 700,
    fontFamily: "Oswald",
    paddingHorizontal: 12,
    width: "35%",
    lineHeight: 1.4,
    textAlign: "center",
  },
  postageInfo: {
    fontSize: 10,
    lineHeight: 1.2,
    borderLeft: "1px solid black",
    paddingTop: 8,
    paddingHorizontal: 10,
    fontWeight: 600,
    width: "100%",
    fontFamily: "Oswald",
  },
  easypost: {
    fontFamily: "Oswald",
    fontSize: 18,
    fontWeight: 500,
  },
  top_left_heading: {
    fontSize: 8.5,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "black",
  },
  serviceLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.6,
    fontFamily: "Oswald",
  },
  trackingCodeTop: {
    textAlign: "center",
  },
  addressBlock: {
    marginVertical: 4,
    lineHeight: 1.2,
  },
  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 4,
    fontSize: 8,
    fontWeight: 400,
    lineHeight: 1.2,
    fontFamily: "Poppins",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  routeBox: {
    border: 1,
    paddingLeft: 4,
    paddingRight: 8,
    marginRight: 40,
    marginTop: -6,
    fontSize: 13,
    fontWeight: 600,
    alignSelf: "flex-end",
    fontFamily: "Oswald",
  },
  skuBlock: {
    alignSelf: "flex-end",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1.2,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  barcodeSection: {
    borderTop: 2,
    borderBottom: 2,
    marginTop: 10,
    paddingVertical: 2,
    alignItems: "center",
  },
  trackingLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  trackingNumber: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: 600,
  },
  line: {
    height: "1px",
    backgroundColor: "black",
    width: "100%",
  },
  barcode1: {
    flex: 1,
    height: 30,
    marginLeft: 5,
  },
  advantageView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginVertical: 1,
  },
});

const Wallmart_USPS_Priority_Mail = ({ csvData }) => {
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

  return (
    <Document>
      {csvData &&
        csvData.length > 0 &&
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

          const randomNumber = Math.floor(Math.random() * 99);
          const roNumber = `C0${
            randomNumber < 10 ? `0${randomNumber}` : randomNumber
          }`;

          const inputValue = data[23];
          const formattedValue = [
            inputValue?.slice(0, 4),
            inputValue?.slice(4, 8),
            inputValue?.slice(8, 12),
            inputValue?.slice(12, 16),
            inputValue?.slice(16, 20),
            inputValue?.slice(20),
          ].join(" ");

          const data14Parts = data?.[14]?.padStart(5, "0")?.split("-");
          const firstPart = data14Parts[0];
          const outputString = `^FNC1420${firstPart.toString().padStart(5, "0")}^FNC1${
            data?.[23]
          }`;
          const trackingBarcode = generateBarCodeTwoImage(outputString);

          const GS = String.fromCharCode(29);
          const qrcodeData = `${GS}420${firstPart
            .toString()
            .padStart(5, "0")}${GS}${data?.[23]}`;
          const qrcode = generateQrCode(qrcodeData);
          const rawBarcode = groundAdvantageBarcodes[index % groundAdvantageBarcodes.length];
          const convertedBarcode = convertControlPictures(rawBarcode);
          const pfd147Barcode = generatePdf147(convertedBarcode);

          return [
            <Page
              size="A6"
              style={styles.page}
              key={`label-${index}`}
              id={`content-id-${index}`}
            >
              <View style={styles.topRow}>
                <Text style={styles.bigG}>P</Text>

                <View style={styles.postageInfo}>
                  <View style={{ ...styles.flexRow, marginBottom: 10 }}>
                    <View>
                      <Text>US POSTAGE AND FEES PAID</Text>
                      <Text>{dayjs().format("YYYY-MM-DD")}</Text>
                    </View>
                    <Text style={styles.easypost}>easypost</Text>
                  </View>

                  <View style={styles.flexRow}>
                    <View style={{ marginTop: -10 }}>
                      <Text>{data?.[6]}</Text>
                      <Text style={{ marginTop: 2 }}>C867817495</Text>
                      <Text style={{ fontSize: 10, marginTop: 3 }}>
                        Commercial
                      </Text>
                    </View>

                    <View style={styles.barcode1}>
                      {pfd147Barcode && (
                        <Image
                          src={pfd147Barcode}
                          style={{ height: "100%", width: "100%" }}
                        />
                      )}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.flexRow,
                      { marginTop: 4, fontSize: 8, marginBottom: 8 },
                    ]}
                  >
                    <Text>{`${Number(data?.[16])?.toFixed(
                      1,
                    )} LB ZONE ${calculatedZone}`}</Text>
                    <Text style={styles.trackingCodeTop}>
                      {`09010000084${String(
                        Math.floor(Math.random() * 60) + 1,
                      ).padStart(2, "0")}`}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.line} />

              {/* USPS Ground Advantage */}
              <View style={styles.advantageView}>
                <Text style={styles.serviceLabel}>USPS PRIORITY MAIL</Text>
              </View>

              <View style={styles.line} />

              {/* From & To addresses */}
              <View style={styles.addressSection}>
                <View>
                  <Text>{data?.[0]}</Text>
                  <Text>{data?.[2]}</Text>
                  <Text>{`${data?.[4]} ${data?.[5]} ${data?.[6]}`}</Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "Oswald",
                  }}
                >
                  0003
                </Text>
              </View>

              <Text style={styles.routeBox}>{roNumber}</Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                  paddingLeft: 10,
                  marginTop: 25,
                }}
              >
                <View style={{ height: 30, width: 30, marginTop: 8 }}>
                  {qrcode && <Image src={qrcode} style={{ height: "100%" }} />}
                </View>

                <View
                  style={{
                    fontSize: 8,
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                    fontFamily: "Poppins",
                    letterSpacing: 0.6,
                    fontWeight: 400,
                  }}
                >
                  <Text>{data?.[8]}</Text>
                  <Text>{data?.[10]}</Text>
                  <Text>{data?.[11] ?? ""}</Text>
                  <Text>{`${data?.[12]} ${data?.[13]} ${data?.[14]?.padStart(
                    5,
                    "0",
                  )}`}</Text>
                </View>
              </View>

              <Text
                style={{
                  marginHorizontal: 8,
                  height: 20,
                  marginTop: 6,
                  fontWeight: 500,
                  fontSize: 10,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  fontFamily: "Oswald",
                }}
              >
                {data?.[21]}
              </Text>

              <View style={{ flex: 1 }} />

              {/* Barcode */}
              <View style={styles.barcodeSection}>
                <Text style={styles.trackingLabel}>USPS TRACKING #</Text>
                <View
                  // src={data?.barcodeImage}
                  style={{ width: 230, height: 50 }}
                >
                  {trackingBarcode && (
                    <Image src={trackingBarcode} style={{ height: "100%" }} />
                  )}
                </View>
                <Text style={styles.trackingNumber}>{formattedValue}</Text>
              </View>

              <View
                style={{
                  height: 30,
                  width: 30,
                  marginVertical: 8,
                  marginRight: 8,
                  alignSelf: "flex-end",
                }}
              >
                {qrcode && <Image src={qrcode} style={{ height: "100%" }} />}
              </View>
            </Page>,
            <PackingSlipPage key={`slip-${index}`} data={data} index={index} />
          ];
        })}
    </Document>
  );
};

export default Wallmart_USPS_Priority_Mail;
