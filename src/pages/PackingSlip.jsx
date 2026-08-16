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

Font.register({
  family: "Poppins",
  fonts: [
    { src: "/Poppins/Poppins-Medium.ttf", fontWeight: 400 },
    { src: "/Poppins/Poppins-Medium.ttf", fontWeight: 500 },
    { src: "/Poppins/Poppins-SemiBold.ttf", fontWeight: 600 },
    { src: "/Poppins/Poppins-Bold.ttf", fontWeight: 700 },
    { src: "/Poppins/Poppins-ExtraBold.ttf", fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Poppins",
  },
  container: {
    borderWidth: 1.5,
    borderColor: "#000",
    height: "100%",
    padding: 12,
    position: "relative",
  },
  // Top Header Area
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    paddingBottom: 6,
    marginBottom: 8,
  },
  companyLogo: {
    fontSize: 16,
    fontWeight: 900,
    color: "#000",
    textTransform: "uppercase",
  },
  docTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#000",
    textAlign: "right",
    textTransform: "uppercase",
  },
  metaText: {
    fontSize: 8.5,
    color: "#444",
    marginTop: 2,
    fontWeight: 500,
  },
  metaValue: {
    fontWeight: 700,
    color: "#000",
  },

  // Addresses Section
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  addressCol: {
    width: "48%",
    padding: 6,
    borderWidth: 0.8,
    borderColor: "#aaa",
    borderRadius: 3,
    backgroundColor: "#fcfcfc",
  },
  addressTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#111",
    textTransform: "uppercase",
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
    paddingBottom: 2,
    letterSpacing: 0.3,
  },
  addressText: {
    fontSize: 8.5,
    color: "#222",
    lineHeight: 1.35,
    fontFamily: "Helvetica",
  },

  // Items Table Section
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eaeaea",
    borderBottomWidth: 1.2,
    borderBottomColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  tableHeaderCol1: {
    width: "80%",
    fontSize: 8.5,
    fontWeight: 700,
    color: "#000",
    textTransform: "uppercase",
  },
  tableHeaderCol2: {
    width: "20%",
    fontSize: 8.5,
    fontWeight: 700,
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.8,
    borderBottomColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableCol1: {
    width: "80%",
  },
  tableCol2: {
    width: "20%",
    textAlign: "center",
    justifyContent: "center",
  },
  itemDesc: {
    fontSize: 9,
    color: "#000",
    fontWeight: 500,
    lineHeight: 1.3,
    fontFamily: "Helvetica",
  },
  itemRef: {
    fontSize: 7.5,
    color: "#444",
    marginTop: 2,
    fontFamily: "Helvetica",
  },
  itemQty: {
    fontSize: 9,
    color: "#000",
    fontWeight: 600,
    fontFamily: "Helvetica",
  },

  // Divider / Spacing
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    position: "absolute",
    bottom: 155,
    left: 12,
    right: 12,
  },

  // Bottom Tracking Section
  trackingContainer: {
    position: "absolute",
    bottom: 50,
    left: 12,
    right: 12,
    alignItems: "center",
  },
  trackingTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#000",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  barcodeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    height: 52,
    width: 220,
    paddingVertical: 2,
  },
  barcodeImage: {
    height: "100%",
    width: "100%",
  },
  trackingNumberText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 3,
    fontWeight: 600,
    color: "#000",
    letterSpacing: 0.5,
  },

  // Summary Manifest Page Styles
  summaryPage: {
    backgroundColor: "#fff",
    fontFamily: "Poppins",
  },
  summaryContainer: {
    borderWidth: 1.5,
    borderColor: "#000",
    height: "100%",
    paddingTop: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 3,
    color: "#000",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 3,
    width: "100%",
    textAlign: "center",
  },
  summarySubtitle: {
    fontSize: 8.5,
    color: "#444",
    marginBottom: 6,
    textAlign: "center",
    lineHeight: 1.4,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 1,
  },
  summaryGridItem: {
    width: "49.5%",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#ccc",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#fcfcfc",
  },
  summaryGridBarcode: {
    width: "100%",
    height: 24,
    marginVertical: 3,
  },
  summaryGridText: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: "#222",
  },
});

const chunkArray = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

export const getCurrentDateFormatted = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");
  return `${month}/${date}/${year}`;
};

export const generateBarcodeImage = (barcodeValue) => {
  if (!barcodeValue) return null;
  const canvas = document.createElement("canvas");
  try {
    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: barcodeValue,
      scale: 1,
      height: 10,
      includetext: false,
      textxalign: "center",
      parsefnc: true,
    });
    return canvas.toDataURL();
  } catch (e) {
    console.error("Error generating packing slip barcode:", e);
    return null;
  }
};

export const PackingSlipPage = ({ data, index }) => {
  if (!data) return null;

  const getVal = (key, fallback = "") => {
    if (data[key] !== undefined && data[key] !== null) {
      return String(data[key]).trim();
    }
    return fallback;
  };

  const fromCompany = getVal(0) || getVal(1) || "Pk 99";
  const fromStreet = getVal(2);
  const fromStreet2 = getVal(3);
  const fromCity = getVal(4);
  const fromState = getVal(5);
  const fromZip = getVal(6);

  const toName = getVal(8);
  const toStreet = getVal(10);
  const toStreet2 = getVal(11);
  const toCity = getVal(12);
  const toState = getVal(13);
  const toZip = getVal(14);
  const ToPhone = getVal(15);

  const description = getVal(20);
  const reference1 = getVal(21);
  const reference2 = getVal(22);
  const trackingId = getVal(23);

  // Format tracking number text: groups of 4 digits
  let formattedTracking = [
    trackingId?.slice(0, 4),
    trackingId?.slice(4, 8),
    trackingId?.slice(8, 12),
    trackingId?.slice(12, 16),
    trackingId?.slice(16, 20),
    trackingId?.slice(20),
  ]
    .filter(Boolean)
    .join(" ");

  const zipVal = String(toZip || "");
  const data14Parts = zipVal ? zipVal.split("-") : [];
  const firstPart = data14Parts[0] || "";
  const outputString = trackingId
    ? `^FNC1420${firstPart.toString().padStart(5, "0")}^FNC1${trackingId}`
    : "";
  const barcodeUrl = outputString ? generateBarcodeImage(outputString) : null;

  return (
    <Page size="A6" key={index} style={styles.page}>
      <View style={styles.container}>
        {/* Upper Metadata / Header Row */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.companyLogo}>PACKING SLIP</Text>
            <Text style={styles.metaText}>
              Order Ref: <Text style={styles.metaValue}>{reference1}</Text>
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", textAlign: "right" }}>
            <Text style={styles.metaText}>
              Date: <Text style={styles.metaValue}>{getCurrentDateFormatted()}</Text>
            </Text>
            <Text
              style={[styles.metaText, { marginTop: 1 }]}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </View>

        {/* Addresses Grid Row */}
        <View style={styles.addressRow}>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>Ship From</Text>
            <Text style={styles.addressText}>{fromCompany}</Text>
            <Text style={styles.addressText}>{fromStreet}</Text>
            {fromStreet2 ? (
              <Text style={styles.addressText}>{fromStreet2}</Text>
            ) : null}
            <Text style={styles.addressText}>
              {`${fromCity} ${fromState} ${fromZip}`.trim()}
            </Text>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>Ship To</Text>
            <Text style={styles.addressText}>{toName}</Text>
            <Text style={styles.addressText}>{toStreet}</Text>
            {toStreet2 ? (
              <Text style={styles.addressText}>{toStreet2}</Text>
            ) : null}
            <Text style={styles.addressText}>
              {`${toCity} ${toState} ${toZip}`.trim()}
            </Text>
          </View>
        </View>

        {/* Product Details Section (Table format) */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCol1}>Item Description</Text>
          {ToPhone && <Text style={styles.tableHeaderCol2}>Qty</Text>}
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol1}>
            <Text style={styles.itemDesc}>{description}</Text>
            {reference2 ? (
              <Text style={styles.itemRef}>{reference2}</Text>
            ) : null}
          </View>
          <View style={styles.tableCol2}>
            {ToPhone && <Text style={styles.itemQty}>{ToPhone}</Text>}
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Tracking ID Section */}
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingTitle}>Tracking id</Text>
          {barcodeUrl && (
            <View style={styles.barcodeWrapper}>
              <Image src={barcodeUrl} style={styles.barcodeImage} />
            </View>
          )}
          <Text style={styles.trackingNumberText}>
            {formattedTracking}
          </Text>
        </View>
      </View>
    </Page>
  );
};

const PackingSlip = ({ csvData }) => {
  return (
    <Document>
      {csvData &&
        csvData?.length > 0 &&
        csvData?.map((data, index) => (
          <PackingSlipPage key={index} data={data} index={index} />
        ))}


      {(() => {
        const barcodesData = csvData
          ? csvData
              .map((d, idx) => {
                if (!d) return null;
                const tracking = d[23] !== undefined && d[23] !== null ? String(d[23]).trim() : "";
                if (!tracking) return null;
                const zipVal = String(d[14] || "").trim();
                const data14Parts = zipVal ? zipVal.split("-") : [];
                const firstPart = data14Parts[0] || "";
                const zip = firstPart.toString().padStart(5, "0");
                const outputString = `^FNC1420${zip}^FNC1${tracking}`;
                const barcodeUrl = generateBarcodeImage(outputString);
                
                // Format tracking number text
                let formattedTracking = [
                  tracking?.slice(0, 4),
                  tracking?.slice(4, 8),
                  tracking?.slice(8, 12),
                  tracking?.slice(12, 16),
                  tracking?.slice(16, 20),
                  tracking?.slice(20),
                ]
                  .filter(Boolean)
                  .join(" ");

                return {
                  idx: idx + 1,
                  tracking: formattedTracking,
                  barcodeUrl,
                };
              })
              .filter(Boolean)
          : [];

        if (barcodesData.length <= 1) return null;

        const chunks = chunkArray(barcodesData, 10);

        return chunks.map((chunk, pageIdx) => (
          <Page size="A6" key={`summary-page-${pageIdx}`} style={styles.summaryPage}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>
                Batch Manifest Summary ({pageIdx + 1}/{chunks.length})
              </Text>

              <View style={styles.summaryGrid}>
                {chunk.map((item, i) => (
                  <View key={i} style={styles.summaryGridItem}>
                    <Text style={{ fontSize: 7, color: "#666", marginBottom: 2 }}>Label #{item.idx}</Text>
                    {item.barcodeUrl && (
                      <Image src={item.barcodeUrl} style={styles.summaryGridBarcode} />
                    )}
                    <Text style={styles.summaryGridText}>{item.tracking}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Page>
        ));
      })()}
    </Document>
  );
};

export default PackingSlip;
