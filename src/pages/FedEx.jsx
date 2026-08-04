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

// Register fonts
Font.register(
  {
    family: "tech-font",
    fonts: [
      {
        src: "/public/VT323/VT323-Regular.ttf",
        fontWeight: 400,
      },
    ],
  },
  {
    family: "Helvetica-Bold",
    src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf",
  }
);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "tech-font",
    padding: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  topParent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1.5px solid #000",
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 5,
  },
  topLeftChild: {
    width: "55%",
    fontSize: 11,
    lineHeight: 1.3,
  },
  topRightChild: {
    width: "45%",
    borderLeft: "1.5px solid #000",
    paddingLeft: 8,
    paddingTop: 2,
    fontSize: 11,
    lineHeight: 1.3,
  },
  // TO Section
  toSection: {
    borderBottom: "1.5px solid #000",
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 8,
  },
  toLabel: {
    fontSize: 11,
    marginBottom: 3,
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    marginBottom: 4,
    marginTop: 2,
  },
  recipientAddress: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    lineHeight: 1.35,
  },
  usLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 32,
    textAlign: "right",
    paddingRight: 15,
    marginTop: 8,
  },
  // Reference Section
  refSection: {
    borderBottom: "1.5px solid #000",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  refLeft: {
    fontSize: 11,
    lineHeight: 1.3,
    width: "50%",
  },
  refRight: {
    fontSize: 11,
    lineHeight: 1.3,
    width: "50%",
    textAlign: "right",
  },
  // Barcode Section
  barcodeSection: {
    borderBottom: "1.5px solid #000",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pdf417Container: {
    width: "70%",
  },
  pdf417Image: {
    width: "100%",
    height: 85,
  },
  fedexLogo: {
    width: "28%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 5,
  },
  fedexText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    marginBottom: 2,
  },
  homeDeliveryText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 8,
  },
  hBox: {
    border: "3px solid #000",
    width: 60,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  hLetter: {
    fontFamily: "Helvetica-Bold",
    fontSize: 48,
  },
  itemDescription: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottom: "1.5px solid #000",
  },
  // Tracking Section
  trackingSection: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 12,
    paddingBottom: 8,
  },
  trkLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginBottom: 4,
  },
  trackingNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 32,
    marginBottom: 8,
  },
  zipCode: {
    fontFamily: "Helvetica-Bold",
    fontSize: 36,
    textAlign: "right",
    marginBottom: 12,
    marginTop: -5,
  },
  trackingBarcodeNumber: {
    fontFamily: "Helvetica",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 2,
  },
  trackingBarcodeImage: {
    width: "100%",
    height: 50,
  },
});

const FedEx = ({ csvData }) => {
  const generateBarcode = (value) => {
    const canvas = document.createElement("canvas");
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: value,
        scale: 3,
        height: 15,
        includetext: false,
        textxalign: "center",
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
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = monthNames[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
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

          // Generate routing number
          const randomNumber = Math.floor(Math.random() * 99);
          const routingNumber = `C${randomNumber.toString().padStart(3, "0")}`;

          // Format tracking number
          const trackingNumber = data[23] || "";
          const formattedTracking = [
            trackingNumber?.slice(0, 4),
            trackingNumber?.slice(4, 8),
            trackingNumber?.slice(8, 12),
          ]
            .filter(Boolean)
            .join(" ");

          // Generate barcodes
          const zipCode = data[14]?.split("-")[0]?.padStart(5, "0") || "00000";
          const barcodeValue = `420${zipCode}${trackingNumber}`;
          const trackingBarcode = generateBarcode(barcodeValue);

          // PDF417 barcode
          const pdf417Value = `[420]${zipCode}[${trackingNumber?.slice(
            0,
            2
          )}]${trackingNumber?.slice(2)}`;
          const pdf417Barcode = generatePdf417(pdf417Value);

          // Full tracking barcode number
          const fullBarcodeNumber = `9632 0804 0 (000 000 0000) 0 00 ${trackingNumber?.slice(
            0,
            4
          )} ${trackingNumber?.slice(4, 8)} ${trackingNumber?.slice(8, 12)}`;

          return (
            <Page
              size="A6"
              style={styles.page}
              key={index}
              id={`content-id-${index}`}
            >
              <View style={styles.container}>
                {/* Top Section */}
                <View style={styles.topParent}>
                  <View style={styles.topLeftChild}>
                    <Text>{data[0]?.toUpperCase()}</Text>
                    <Text>{data[2]?.toUpperCase()}</Text>
                    <Text>{`${data[4]?.toUpperCase()} ${data[5]?.toUpperCase()} ${data[6]?.toUpperCase()}`}</Text>
                    <Text>{data[7]?.toUpperCase()}</Text>
                  </View>
                  <View style={styles.topRightChild}>
                    <Text>SHIP DATE: {getCurrentDate()}</Text>
                    <Text>ACTWGT: {data[16]} LB</Text>
                    <Text>CAD: 000001870 / FUSE</Text>
                    <Text>DIMMED: 15 X 8 X 8 IN</Text>
                    <Text>BILL SENDER</Text>
                  </View>
                </View>

                {/* TO Section */}
                <View style={styles.toSection}>
                  <Text style={styles.toLabel}>TO</Text>
                  <Text style={styles.recipientName}>
                    {data[8]?.toUpperCase()}
                  </Text>
                  <Text style={styles.recipientAddress}>
                    {data[10]?.toUpperCase()}
                  </Text>
                  <Text style={styles.recipientAddress}>
                    {`${data[12]?.toUpperCase()} ${data[13]?.toUpperCase()} ${data[14]?.toUpperCase()}`}
                  </Text>
                  <Text style={styles.usLabel}>(US)</Text>
                </View>

                {/* Reference Numbers Section */}
                <View style={styles.refSection}>
                  <View style={styles.refLeft}>
                    <Text>{data[22] || "3059342491"}</Text>
                    <Text>INV:</Text>
                    <Text>PO: {data[21] || "129020118858988"}</Text>
                  </View>
                  <View style={styles.refRight}>
                    <Text>REF: {data[21] || "129020118858988"}</Text>
                    <Text>RMA:</Text>
                    <Text>DEPT:</Text>
                  </View>
                </View>

                {/* Barcode Section with FedEx Logo */}
                <View style={styles.barcodeSection}>
                  <View style={styles.pdf417Container}>
                    {pdf417Barcode && (
                      <Image src={pdf417Barcode} style={styles.pdf417Image} />
                    )}
                  </View>
                  <View style={styles.fedexLogo}>
                    <Text style={styles.fedexText}>FedEx</Text>
                    <Text style={styles.homeDeliveryText}>Home Delivery</Text>
                    <View style={styles.hBox}>
                      <Text style={styles.hLetter}>H</Text>
                    </View>
                  </View>
                </View>

                {/* Item Description */}
                <View style={styles.itemDescription}>
                  <Text>
                    {data[18] ||
                      "Kleenex Anti-Viral 3-Ply Facial (55 Tissues) 3 pieces"}
                  </Text>
                </View>

                {/* Tracking Number Section */}
                <View style={styles.trackingSection}>
                  <Text style={styles.trkLabel}>TRK#</Text>
                  <Text style={styles.trackingNumber}>{formattedTracking}</Text>
                  <Text style={styles.zipCode}>{zipCode}</Text>

                  <Text style={styles.trackingBarcodeNumber}>
                    {fullBarcodeNumber}
                  </Text>
                  {trackingBarcode && (
                    <Image
                      src={trackingBarcode}
                      style={styles.trackingBarcodeImage}
                    />
                  )}
                </View>
              </View>
            </Page>
          );
        })}
    </Document>
  );
};

export default FedEx;
