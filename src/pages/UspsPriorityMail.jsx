import React from "react";
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
  page: {
    padding: 20,
    fontSize: 12,
  },
  container: {
    border: "1px solid black",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  address: {
    marginBottom: 10,
  },
  barcode: {
    alignItems: "center",
  },
  barcodeImage: {
    width: 200,
    height: 50,
  },
  trackingNumber: {
    marginTop: 10,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});

const generateBarcode = (value) => {
  try {
    const canvas = document.createElement("canvas");
    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: value,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
    return canvas.toDataURL("image/png");
  } catch (e) {
    return "";
  }
};

const UspsPriorityMail = ({ data }) => {
  const barcodeData = generateBarcode(data?.trackingNumber);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.bold}>PRIORITY MAIL</Text>
              <Text>U.S. POSTAGE PAID</Text>
              <Text>ATFM</Text>
              <Text>e-Postage</Text>
            </View>
            <View>
              <Text>Tx warehouse</Text>
              <Text>720 F Avenue Ste 107</Text>
              <Text>Plano TX 75074</Text>
              <Text>Mailed From 75074</Text>
              <Text>WT: 8.0000 lb</Text>
            </View>
          </View>
          <View style={styles.address}>
            <Text>SHIP</Text>
            <Text>TO: {data?.toName}</Text>
            <Text>{data?.toAddress}</Text>
            <Text>{data?.toCityStateZip}</Text>
          </View>
          <View style={styles.barcode}>
            {barcodeData && (
              <Image style={styles.barcodeImage} src={barcodeData} />
            )}
            <Text style={styles.trackingNumber}>{data?.trackingNumber}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default UspsPriorityMail;
