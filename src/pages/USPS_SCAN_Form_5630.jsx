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
import uspsScanLogo from "../assets/images/usps_scan_logo.png";

// Register fonts
Font.register({
  family: "Helvetica-Bold",
  src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 28,
    fontSize: 9,
    color: "#000000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  logoImage: {
    width: 200,
    height: 38,
    objectFit: "contain",
    marginLeft: -4,
    marginTop: -4,
  },
  titleBlock: {
    alignItems: "flex-end",
    paddingTop: 2,
  },
  titleText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    lineHeight: 1.15,
  },
  blueBanner: {
    backgroundColor: "#004B87",
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    marginBottom: 8,
    marginTop: 2,
  },
  bannerText: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  sectionAContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftNoteBlock: {
    width: "46%",
    paddingRight: 10,
  },
  noteTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.25,
  },
  noteBody: {
    fontFamily: "Helvetica",
    fontSize: 9,
  },
  rightAddressBlock: {
    width: "48%",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 3,
  },
  fieldLabel: {
    fontSize: 9,
    fontFamily: "Helvetica",
    textAlign: "right",
    width: 72,
    marginRight: 4,
  },
  underlineContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    fontFamily: "Helvetica",
    paddingLeft: 3,
  },
  tableContainer: {
    width: "65%",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  tableInner: {
    position: "relative",
  },
  centerVerticalLine: {
    position: "absolute",
    left: "58%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingVertical: 3,
  },
  col1Header: {
    width: "58%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    textAlign: "center",
  },
  col2Header: {
    width: "42%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingVertical: 3,
  },
  col1Cell: {
    width: "58%",
    fontSize: 9,
    paddingLeft: 10,
  },
  col2Cell: {
    width: "42%",
    fontSize: 9,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingVertical: 3,
  },
  totalLabel: {
    width: "58%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "right",
    paddingRight: 10,
  },
  totalValue: {
    width: "42%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "center",
  },
  tableFootnote: {
    fontSize: 7,
    marginTop: 4,
    color: "#222222",
    lineHeight: 1.15,
  },
  uspsEmployeeNote: {
    fontSize: 9.5,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 1.3,
  },
  thickBlackBar: {
    height: 3.5,
    backgroundColor: "#000000",
    width: "66%",
    alignSelf: "center",
    marginBottom: 6,
  },
  scanTitle: {
    fontSize: 12.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  scanBarcode: {
    width: 320,
    height: 52,
    alignSelf: "center",
    marginBottom: 4,
  },
  scanText: {
    fontSize: 12.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 3,
    marginTop: 10,
  },
  footerText: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
  },
});

const generateScanBarcode = (trackingNum) => {
  const canvas = document.createElement("canvas");
  try {
    const rawDigits = trackingNum ? trackingNum.replace(/\s+/g, "") : "";
    let scanCode = rawDigits;

    // Standard USPS SCAN form barcode (22-26 digits starting with 9275)
    if (!scanCode || scanCode.length < 10) {
      scanCode = "92750903249922000027625285";
    } else if (!scanCode.startsWith("9275")) {
      if (scanCode.length >= 18) {
        scanCode = "9275" + scanCode.slice(4);
      } else {
        scanCode = "92750903" + scanCode;
      }
    }

    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: "^FNC1" + scanCode,
      scale: 3,
      height: 18,
      includetext: false,
      parsefnc: true,
    });
    return { dataUrl: canvas.toDataURL(), code: scanCode };
  } catch (error) {
    console.error("Error generating SCAN form barcode:", error);
    return { dataUrl: "", code: "92750903249922000027625285" };
  }
};

const formatScanCode = (code) => {
  const clean = code.replace(/\s+/g, "");
  return (
    clean.match(/.{1,4}/g)?.join(" ") || "9275 0903 2499 2200 0027 6252 85"
  );
};

const formatDateFormatted = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
};

const extractShipmentDate = (firstRow) => {
  if (!firstRow) return formatDateFormatted();
  
  if (Array.isArray(firstRow)) {
    for (let i = 0; i < firstRow.length; i++) {
      const val = String(firstRow[i] || "").trim();
      if (
        val &&
        (val.includes("/") || val.includes("-")) &&
        /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(val)
      ) {
        return val;
      }
    }
  } else if (typeof firstRow === "object") {
    for (const key of Object.keys(firstRow)) {
      if (key.toLowerCase().includes("date")) {
        const val = String(firstRow[key]).trim();
        if (val) return val;
      }
    }
  }
  
  return formatDateFormatted();
};

const USPS_SCAN_Form_5630 = ({ csvData }) => {
  if (!csvData || csvData.length === 0) return null;

  // Extract Shipped From details from first CSV row
  const firstRow = csvData[0] || [];
  
  const safeCell = (idx, fallback = "") => {
    const val = firstRow[idx];
    return val !== undefined && val !== null && String(val).trim() !== ""
      ? String(val).trim()
      : fallback;
  };

  const nameVal = safeCell(0, "1");
  const addressVal = safeCell(2, "3400 DOVER DR");
  const cityVal = safeCell(4, "McKinney");
  const stateVal = safeCell(5, "TX");
  const zipVal = safeCell(6, "75069-7715");
  const dateVal = extractShipmentDate(firstRow);

  // Count mail volumes across CSV rows
  let priorityExpressCount = 0;
  let priorityCount = 0;
  let groundAdvantageCount = 0;
  let returnsCount = 0;
  let intlCount = 0;
  let connectLocalCount = 0;
  let connectLocalMailCount = 0;
  let connectRegionalCount = 0;
  let otherCount = 0;

  let firstTrackingNumber = "";

  csvData.forEach((row) => {
    const tracking = String(row[23] || row[22] || "").trim();
    if (!firstTrackingNumber && tracking) {
      firstTrackingNumber = tracking;
    }

    const service = String(row[20] || row[21] || "").toLowerCase();
    
    if (tracking.startsWith("9270") || service.includes("express")) {
      priorityExpressCount++;
    } else if (tracking.startsWith("94") || service.includes("priority")) {
      priorityCount++;
    } else if (service.includes("return")) {
      returnsCount++;
    } else if (service.includes("intl") || service.includes("international")) {
      intlCount++;
    } else if (service.includes("connect local mail")) {
      connectLocalMailCount++;
    } else if (service.includes("connect local")) {
      connectLocalCount++;
    } else if (service.includes("connect regional")) {
      connectRegionalCount++;
    } else if (service.includes("other")) {
      otherCount++;
    } else {
      groundAdvantageCount++;
    }
  });

  const totalVolume = csvData.length;

  const { dataUrl: scanBarcodeUrl, code: scanCode } =
    generateScanBarcode(firstTrackingNumber);
  const formattedScanCodeText = formatScanCode(scanCode);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Image src={uspsScanLogo} style={styles.logoImage} />
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>Shipment Confirmation</Text>
            <Text style={styles.titleText}>Acceptance Notice</Text>
          </View>
        </View>

        {/* Section A Blue Banner */}
        <View style={styles.blueBanner}>
          <Text style={styles.bannerText}>A. Mailer Action</Text>
        </View>

        {/* Section A Content */}
        <View style={styles.sectionAContent}>
          {/* Note to Mailer */}
          <View style={styles.leftNoteBlock}>
            <Text style={styles.noteTitle}>
              Note To Mailer:{" "}
              <Text style={styles.noteBody}>
                The labels and volumes associated to this form online{" "}
                <Text style={{ fontFamily: "Helvetica-Bold" }}>must</Text> match the labeled
                packages being presented to the USPS
              </Text>
              &#178;
              <Text style={styles.noteBody}>
                employee with this form.
              </Text>
            </Text>
          </View>

          {/* Shipped From Address Block (Compact on far right) */}
          <View style={styles.rightAddressBlock}>
            {/* Shipment Date */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Shipment Date:</Text>
              <View style={styles.underlineContainer}>
                <Text style={styles.fieldValue}>{dateVal}</Text>
              </View>
            </View>

            {/* Shipped From Header */}
            <View style={{ marginTop: 2, marginBottom: 1, paddingLeft: 28 }}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica" }}>
                Shipped From:
              </Text>
            </View>

            {/* Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Name:</Text>
              <View style={styles.underlineContainer}>
                <Text style={styles.fieldValue}>{nameVal}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Address:</Text>
              <View style={styles.underlineContainer}>
                <Text style={styles.fieldValue}>{addressVal}</Text>
              </View>
            </View>

            {/* City */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>City:</Text>
              <View style={styles.underlineContainer}>
                <Text style={styles.fieldValue}>{cityVal}</Text>
              </View>
            </View>

            {/* State & Zip */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>State:</Text>
              <View style={{ borderBottomWidth: 1, borderBottomColor: "#000000", paddingBottom: 1, width: 45, marginRight: 8 }}>
                <Text style={styles.fieldValue}>{stateVal}</Text>
              </View>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica", textAlign: "right", marginRight: 4 }}>
                ZIP+4:
              </Text>
              <View style={styles.underlineContainer}>
                <Text style={styles.fieldValue}>{zipVal}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mail Volume Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableInner}>
            {/* Continuous Center Vertical Line (stops before footnote) */}
            <View style={styles.centerVerticalLine} />

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1Header}>Type of Mail</Text>
              <Text style={styles.col2Header}>Volume</Text>
            </View>

            {/* Rows */}
            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>Priority Mail Express&#174;*</Text>
              <Text style={styles.col2Cell}>{priorityExpressCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>Priority Mail &#174;</Text>
              <Text style={styles.col2Cell}>{priorityCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>USPS Ground Advantage&#8482;</Text>
              <Text style={styles.col2Cell}>{groundAdvantageCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>Returns</Text>
              <Text style={styles.col2Cell}>{returnsCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>International*</Text>
              <Text style={styles.col2Cell}>{intlCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>USPS Connect&#8482; Local</Text>
              <Text style={styles.col2Cell}>{connectLocalCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>USPS Connect&#8482; Local Mail</Text>
              <Text style={styles.col2Cell}>{connectLocalMailCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>USPS Connect&#8482; Regional</Text>
              <Text style={styles.col2Cell}>{connectRegionalCount}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.col1Cell}>Other</Text>
              <Text style={styles.col2Cell}>{otherCount}</Text>
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalVolume}</Text>
            </View>
          </View>

          {/* Footnote */}
          <Text style={styles.tableFootnote}>
            *Start time for products with service guarantees will begin when
            mail arrives at the local Post Office&#8482; and items receive
            individual processing and acceptance scans.
          </Text>
        </View>

        {/* Section B Blue Banner */}
        <View style={styles.blueBanner}>
          <Text style={styles.bannerText}>B. USPS Action</Text>
        </View>

        {/* Section B Content */}
        <Text style={styles.uspsEmployeeNote}>
          USPS EMPLOYEE: Please scan upon pickup or receipt of mail.{"\n"}
          Leave form with customer or in customer's mail receptacle.
        </Text>

        <View style={styles.thickBlackBar} />

        <Text style={styles.scanTitle}>USPS SCAN AT ACCEPTANCE</Text>

        {scanBarcodeUrl ? (
          <Image src={scanBarcodeUrl} style={styles.scanBarcode} />
        ) : null}

        <Text style={styles.scanText}>{formattedScanCodeText}</Text>

        <View style={styles.thickBlackBar} />

        {/* Footer Row */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>PS Form 5630</Text>, November 2018      PSN 7530-08-000-4335
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default USPS_SCAN_Form_5630;
