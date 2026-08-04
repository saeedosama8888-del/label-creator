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
import bwipjs from "bwip-js";
import shippingZoneCalculator from "../utils/shippingZoneCalculator";

// Register fonts
Font.register({
  family: "Helvetica-Bold",
  src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
  },
  container: {
    border: "1px solid black",
    borderBottom: "1px solid black",
    marginTop: 10,
    marginHorizontal: 6,
    height: "85%",
    display: "flex",
    flexDirection: "column",
  },
  topSection: {
    flexDirection: "row",
    borderBottom: "2px solid black",
    height: 85,
  },
  gLogoSection: {
    width: 65,
    borderRight: "2px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gImage: {
    width: 50,
    height: 55,
  },
  postageSection: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  postageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  postageLeft: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  postageDate: {
    fontSize: 9,
    marginTop: 2,
  },
  postageFrom: {
    fontSize: 9,
    marginTop: 2,
  },
  postageWeight: {
    fontSize: 9,
    marginTop: 1,
  },
  postageZone: {
    fontSize: 9,
    marginTop: 1,
  },
  pdf417Container: {
    height: 30,
    width: 142,
  },
  postageBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "70%",
    marginLeft: "auto",
    marginTop: -20,
  },
  postageBottomLeft: {
    fontSize: 9,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  carrierInfo: {
    textAlign: "center",
    fontSize: 8,
    marginBottom: 0.7,
  },
  carrierInfo_bold: {
    textAlign: "center",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 0.7,
  },
  banner: {
    backgroundColor: "white",
    borderBottom: "2px solid black",
    paddingVertical: 6,
    textAlign: "center",
  },
  bannerText: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },
  fromSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 6,
    paddingTop: 1,
  },
  fromAddress: {
    fontSize: 9,
  },
  packageNumber: {
    fontSize: 15,
    marginTop: 24,
    marginRight: 26,
    fontFamily: "Helvetica-Bold",
  },
  routingBox: {
    position: "absolute",
    right: 34,
    top: 170,
    border: "1px solid black",
    paddingHorizontal: 2,
    paddingVertical: 0.5,
    paddingBottom: -6,
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },
  toSection: {
    flexDirection: "row",
    padding: 8,
    paddingTop: 45,
    gap: 6,
  },
  qrCode: {
    width: 30,
    height: 30,
  },
  toAddress: {
    marginTop: -6,
    fontSize: 11,
    // lineHeight: 1.3,
    flex: 1,
  },
  trackingSection: {
    borderTop: "3px solid black",
    borderBottom: "2px solid black",
    marginTop: "auto",
    paddingVertical: 6,
  },
  trackingHeader: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  barcodeContainer: {
    height: 55,
    width: 230,
    marginHorizontal: "auto",
    marginBottom: 5,
  },
  trackingNumber: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  bottomQr: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
  },
});

const USPS_Ground_Pitney_Bowes = ({ csvData }) => {
  const generateBarcode = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: value,
        scale: 2,
        height: 12,
        includetext: false,
        textxalign: "center",
        parsefnc: true,
      });
      return canvas.toDataURL();
    } catch (e) {
      console.error("Barcode error:", e);
      return null;
    }
  };

  const generatePdf417 = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: value,
        scale: 2,
        columns: 6,
        rows: 12,
        compact: false,
        includetext: false,
        padding: 0,
      });
      return canvas.toDataURL();
    } catch (e) {
      console.error("PDF417 error:", e);
      return null;
    }
  };

  const generateQrCode = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "datamatrix",
        text: value,
        scale: 3,
        includetext: false,
      });
      return canvas.toDataURL();
    } catch (e) {
      console.error("QR code error:", e);
      return null;
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <Document>
      {csvData &&
        csvData.length > 0 &&
        csvData.map((data, index) => {
          // Fill empty data
          for (let i = 0; i < data.length; i++) {
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

          // Generate routing number
          const randomNumber = Math.floor(Math.random() * 99);
          const routingNumber = `C${randomNumber.toString().padStart(3, "0")}`;

          // Format tracking number
          const trackingNumber = data[23] || "";
          const formattedTracking = [
            trackingNumber?.slice(0, 4),
            trackingNumber?.slice(4, 8),
            trackingNumber?.slice(8, 12),
            trackingNumber?.slice(12, 16),
            trackingNumber?.slice(16, 20),
            trackingNumber?.slice(20),
          ]
            .filter(Boolean)
            .join(" ");

          // Generate barcodes
          const zipCode = data[14]?.split("-")[0]?.padStart(5, "0") || "00000";
          const barcodeValue = `^FNC1420${zipCode}^FNC1${trackingNumber}`;
          const trackingBarcode = generateBarcode(barcodeValue);

          // PDF417 barcode
          const pdf417Value = `[420]${zipCode}[${trackingNumber?.slice(
            0,
            2
          )}]${trackingNumber?.slice(2)}`;
          const pdf417Barcode = generatePdf417(pdf417Value);

          // QR code
          const GS = String.fromCharCode(29);
          const qrValue = `${GS}420${zipCode}${GS}${trackingNumber}`;
          const qrCode = generateQrCode(qrValue);

          return (
            <Page
              size="A6"
              style={styles.page}
              key={index}
              id={`content-id-${index}`}
            >
              <View style={styles.container}>
                {/* Top Section */}
                <View style={styles.topSection}>
                  {/* G Logo Section */}
                  <View style={styles.gLogoSection}>
                    <Image
                      src="https://res.cloudinary.com/hassankhanw3/image/upload/v1760226757/Screenshot_2025-10-11_at_4.29.50_pm_ejof9s.png"
                      style={styles.gImage}
                    />
                  </View>

                  {/* Postage Section */}
                  <View style={styles.postageSection}>
                    <View style={styles.postageHeader}>
                      <View>
                        <Text style={styles.postageLeft}>US POSTAGE</Text>
                        <Text style={styles.postageLeft}>PAID IMI</Text>
                        <Text style={styles.postageDate}>
                          {getCurrentDate()}
                        </Text>
                        <Text style={styles.postageFrom}>
                          From {data[6]?.slice(0, 5)?.padStart(5, "0")}
                        </Text>
                        <Text style={styles.postageWeight}>
                          {data[16]} lbs 0 ozs
                        </Text>
                        <Text style={styles.postageZone}>
                          Zone {calculatedZone}
                        </Text>
                      </View>
                      <View style={styles.pdf417Container}>
                        {pdf417Barcode && (
                          <Image
                            src={pdf417Barcode}
                            style={{ height: "100%", width: "100%" }}
                          />
                        )}
                      </View>
                    </View>
                    <View style={styles.postageBottom}>
                      <View style={styles.postageBottomLeft}>
                        <Text style={styles.carrierInfo_bold}>
                          Pitney Bowes
                        </Text>
                        <Text style={styles.carrierInfo_bold}>CommPrice</Text>
                        <Text style={styles.carrierInfo}>NO SURCHARGE</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 8 }}>028W0005206875</Text>
                        <Text style={{ fontSize: 8, marginTop: 10 }}>
                          2000211393
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* USPS Ground Advantage Banner */}
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>USPS GROUND ADVANTAGE™</Text>
                </View>

                {/* From Address */}
                <View style={styles.fromSection}>
                  <View style={styles.fromAddress}>
                    <Text>{data[0]?.toUpperCase()}</Text>
                    <Text>{data[2]?.toUpperCase()}</Text>
                    <Text>{`${data[4]?.toUpperCase()} ${data[5]?.toUpperCase()} ${data[6]?.toUpperCase()}`}</Text>
                  </View>
                  <Text style={styles.packageNumber}>0001</Text>
                </View>

                {/* Routing Box */}
                <Text style={styles.routingBox}>{routingNumber}</Text>

                {/* To Address */}
                <View style={styles.toSection}>
                  <View style={styles.qrCode}>
                    {qrCode && (
                      <Image
                        src={qrCode}
                        style={{ height: "100%", width: "100%" }}
                      />
                    )}
                  </View>
                  <View style={styles.toAddress}>
                    <Text>{data[8]?.toUpperCase()}</Text>
                    <Text>{data[10]?.toUpperCase()}</Text>
                    <Text>{`${data[12]?.toUpperCase()} ${data[13]?.toUpperCase()} ${data[14]?.padStart(
                      5,
                      "0"
                    )}`}</Text>
                  </View>
                </View>

                {/* Tracking Barcode Section */}
                <View style={styles.trackingSection}>
                  <Text style={styles.trackingHeader}>USPS TRACKING #</Text>
                  <View style={styles.barcodeContainer}>
                    {trackingBarcode && (
                      <Image
                        src={trackingBarcode}
                        style={{ height: "100%", width: "100%" }}
                      />
                    )}
                  </View>
                  <Text style={styles.trackingNumber}>{formattedTracking}</Text>
                </View>
              </View>
              {/* Bottom QR Code */}
              <Text
                style={{
                  fontSize: "8px",
                  marginTop: 10,
                  textAlign: "center",
                  maxWidth: "70%",
                  width: "70%",
                  marginHorizontal: "auto",
                }}
              >
                {data?.[20]?.length > 0 ? data[20] : ""}
              </Text>

              <View style={styles.bottomQr}>
                {qrCode && (
                  <Image
                    src={qrCode}
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </View>
            </Page>
          );
        })}
    </Document>
  );
};

export default USPS_Ground_Pitney_Bowes;
