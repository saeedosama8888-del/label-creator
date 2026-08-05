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
import templateBg from "../assets/images/usps_scan_form_18_template.png";

// Register fonts
Font.register({
  family: "Helvetica-Bold",
  src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    padding: 0,
    margin: 0,
    position: "relative",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 612,
    height: 792,
  },
  whiteCover: {
    position: "absolute",
    backgroundColor: "#ffffff",
  },
  fieldValue: {
    position: "absolute",
    fontSize: 9.1,
    fontFamily: "Helvetica",
    color: "#000000",
  },
  tableCellText: {
    position: "absolute",
    fontSize: 9.1,
    fontFamily: "Helvetica",
    color: "#000000",
    width: 50,
    textAlign: "center",
  },
  tableTotalText: {
    position: "absolute",
    fontSize: 9.1,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    width: 50,
    textAlign: "center",
  },
  scanBarcode: {
    position: "absolute",
    top: 591.8,
    left: 161.4,
    width: 289.2,
    height: 72.7,
    objectFit: "fill",
  },
  scanText: {
    position: "absolute",
    top: 672.6,
    left: 0,
    right: 0,
    fontSize: 12.2,
    fontFamily: "Helvetica",
    textAlign: "center",
    color: "#000000",
  },
});

const generateScanBarcode = (trackingNum) => {
  const canvas = document.createElement("canvas");
  try {
    const rawDigits = trackingNum ? trackingNum.replace(/\s+/g, "") : "";
    let scanCode = rawDigits;

    // Use tracking ID directly from CSV without modifying any digits
    if (!scanCode) {
      scanCode = "92019903960557083812183526";
    }

    // Single FNC1 (^FNC1) at the start for GS1-128 SCAN form barcode -> {GS}92019903960557083812183526
    const barcodeText = scanCode.startsWith("^FNC1") ? scanCode : "^FNC1" + scanCode;

    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: barcodeText,
      scale: 3,
      height: 22,
      includetext: false,
      parsefnc: true,
    });
    return { dataUrl: canvas.toDataURL(), code: scanCode };
  } catch (error) {
    console.error("Error generating SCAN form barcode:", error);
    return { dataUrl: "", code: trackingNum || "92019903960557083812183526" };
  }
};

const formatScanCode = (code) => {
  const clean = code.replace(/\s+/g, "");
  return (
    clean.match(/.{1,4}/g)?.join(" ") || "9201 9903 9605 5708 3812 1835 26"
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
    const col10 = String(firstRow[10] || "").trim();
    if (col10 && /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(col10)) {
      return col10;
    }
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
      if (key.toLowerCase().includes("date") || key.toLowerCase().includes("street")) {
        const val = String(firstRow[key]).trim();
        if (val && /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(val)) return val;
      }
    }
  }

  return formatDateFormatted();
};

const USPS_SCAN_Form_5630 = ({ csvData }) => {
  if (!csvData || csvData.length === 0) return null;

  const firstRow = csvData[0] || [];

  // Smart dynamic parser to handle shifted columns (e.g., when "615 Helena Ave" gets split across 3 cells)
  let nameVal = String(firstRow[0] || "").trim() || "1";
  let addressVal = "3400 DOVER DR";
  let cityVal = "McKinney";
  let stateVal = "TX";
  let zipVal = "75069-7715";
  let priorityCount = 0;
  let groundAdvantageCount = 0;
  let dateVal = extractShipmentDate(firstRow);
  let firstTrackingNumber = "";

  const stateRegex = /^[A-Z]{2}$/i;
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const dateRegex = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/;
  const trackingRegex = /^\d{16,34}$/;

  let zipIndex = -1;
  let stateIndex = -1;
  let dateIndex = -1;

  if (Array.isArray(firstRow)) {
    // 1. Scan for distinct formats: zip, state, date, tracking
    for (let i = 1; i < firstRow.length; i++) {
      const cell = String(firstRow[i] || "").trim();
      if (!cell) continue;

      if (trackingRegex.test(cell) && !firstTrackingNumber) {
        firstTrackingNumber = cell;
      } else if (dateRegex.test(cell) && dateIndex === -1) {
        dateVal = cell;
        dateIndex = i;
      } else if (zipRegex.test(cell) && zipIndex === -1) {
        zipVal = cell;
        zipIndex = i;
      } else if (stateRegex.test(cell) && stateIndex === -1 && i < 15) {
        stateVal = cell.toUpperCase();
        stateIndex = i;
      }
    }

    // 2. City is usually right before state or zip
    let cityIndex = -1;
    const endAddressIndex = Math.min(
      stateIndex !== -1 ? stateIndex : 999,
      zipIndex !== -1 ? zipIndex : 999
    );

    if (endAddressIndex !== 999 && endAddressIndex > 1) {
      for (let i = endAddressIndex - 1; i >= 1; i--) {
        const cell = String(firstRow[i] || "").trim();
        if (cell) {
          cityVal = cell;
          cityIndex = i;
          break;
        }
      }
    }

    // 3. Address is all cells between name (0) and city
    const maxAddressIdx = cityIndex !== -1 ? cityIndex : endAddressIndex;
    const addressParts = [];
    if (maxAddressIdx !== 999) {
      for (let i = 1; i < maxAddressIdx; i++) {
        const cell = String(firstRow[i] || "").trim();
        if (cell && !stateRegex.test(cell) && !zipRegex.test(cell) && !dateRegex.test(cell)) {
          addressParts.push(cell);
        }
      }
      if (addressParts.length > 0) {
        addressVal = addressParts.join(" ");
      }
    }

    // 4. Volumes: 
    // In a normal CSV, ToName (Priority) is col 8, ToCompany (Ground) is col 9
    // If the CSV is shifted (e.g. ZIP code is at col 8), then we read cols 9 and 10 instead.
    const strictP = String(firstRow[8] || "").trim();
    const strictG = String(firstRow[9] || "").trim();

    if (!zipRegex.test(strictP)) {
      priorityCount = parseInt(strictP, 10) || 0;
      groundAdvantageCount = parseInt(strictG, 10) || 0;
    } else {
      priorityCount = parseInt(String(firstRow[9] || "").trim(), 10) || 0;
      groundAdvantageCount = parseInt(String(firstRow[10] || "").trim(), 10) || 0;
    }
  }

  const totalVolume = priorityCount + groundAdvantageCount;

  if (!firstTrackingNumber && Array.isArray(csvData)) {
    for (const row of csvData) {
      if (Array.isArray(row)) {
        for (let i = row.length - 1; i >= 0; i--) {
          const val = String(row[i] || "").trim();
          if (trackingRegex.test(val)) {
            firstTrackingNumber = val;
            break;
          }
        }
      }
      if (firstTrackingNumber) break;
    }
  }

  const { dataUrl: scanBarcodeUrl, code: scanCode } =
    generateScanBarcode(firstTrackingNumber);
  const formattedScanCodeText = formatScanCode(scanCode);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Background Image (Ditto Copy of SCAN-Form_18_blank_template.pdf) */}
        <Image src={templateBg} style={styles.bgImage} />

        {/* White Cover Overlays for Shipped From text ONLY (stops 2.2pt above baseline to keep original thin underline untouched) */}
        <View style={[styles.whiteCover, { top: 77.0, left: 405.0, width: 190.0, height: 11.5 }]} />
        <View style={[styles.whiteCover, { top: 107.5, left: 405.0, width: 190.0, height: 11.3 }]} />
        <View style={[styles.whiteCover, { top: 122.5, left: 405.0, width: 190.0, height: 11.5 }]} />
        <View style={[styles.whiteCover, { top: 137.8, left: 405.0, width: 190.0, height: 11.5 }]} />
        <View style={[styles.whiteCover, { top: 153.0, left: 405.0, width: 31.0, height: 11.5 }]} />
        <View style={[styles.whiteCover, { top: 153.0, left: 473.0, width: 122.0, height: 11.5 }]} />

        {/* Mail Volume Table covers */}
        <View style={[styles.whiteCover, { top: 239, left: 380, width: 50, height: 14 }]} />
        <View style={[styles.whiteCover, { top: 262, left: 380, width: 50, height: 14 }]} />
        <View style={[styles.whiteCover, { top: 422, left: 380, width: 50, height: 14 }]} />

        {/* Barcode & Tracking text area cover (between top and bottom black bars) */}
        <View style={[styles.whiteCover, { top: 590.0, left: 155.0, width: 302.0, height: 98.0 }]} />

        {/* Dynamic Overlays */}
        <Text style={[styles.fieldValue, { top: 77.5, left: 407.24 }]}>{dateVal}</Text>
        <Text style={[styles.fieldValue, { top: 107.9, left: 407.24 }]}>{nameVal}</Text>
        <Text style={[styles.fieldValue, { top: 123.1, left: 407.24 }]}>{addressVal}</Text>
        <Text style={[styles.fieldValue, { top: 138.4, left: 407.24 }]}>{cityVal}</Text>
        <Text style={[styles.fieldValue, { top: 153.6, left: 407.24 }]}>{stateVal}</Text>
        <Text style={[styles.fieldValue, { top: 153.6, left: 475.75 }]}>{zipVal}</Text>

        <Text style={[styles.tableCellText, { top: 241.9, left: 380 }]}>{priorityCount}</Text>
        <Text style={[styles.tableCellText, { top: 264.7, left: 380 }]}>{groundAdvantageCount}</Text>
        <Text style={[styles.tableTotalText, { top: 424.6, left: 380 }]}>{totalVolume}</Text>

        {scanBarcodeUrl ? (
          <Image src={scanBarcodeUrl} style={styles.scanBarcode} />
        ) : null}

        <Text style={styles.scanText}>{formattedScanCodeText}</Text>
      </Page>
    </Document>
  );
};

export default USPS_SCAN_Form_5630;
