import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// All current hardcoded values from USPS_Ground_Advantage_Cubic_Copy.jsx
// These serve as the defaults that the user can reset to.
export const DEFAULT_CUBIC_COPY_CONFIG = {
  gLogo: {
    label: "G Logo",
    fontSize: 70,
    offsetX: 0,
    offsetY: 0,
    bold: true,
  },
  cubicText: {
    label: "CUBIC Text",
    fontSize: 9.5,
    offsetX: 0,
    offsetY: -5,
    marginRight: 10,
    bold: false,
  },
  postageBox: {
    label: "Postage Info Box",
    fontSize: 7.2,
    offsetX: 0,
    offsetY: 0,
    bold: false,
    boxWidth: 82,
    marginRight: 16,
  },
  banner: {
    label: "USPS GROUND ADVANTAGE ™ Banner",
    fontSize: 15.2,
    tmFontSize: 7.5,
    offsetX: 0,
    offsetY: 0,
    bold: true,
  },
  senderAddress: {
    label: "Sender Address",
    fontSize: 7.8,
    offsetX: 0,
    offsetY: 0,
    bold: false,
  },
  dateWeight: {
    label: "Date / Weight",
    fontSize: 6.8,
    offsetX: 0,
    offsetY: 0,
    bold: false,
  },
  shipTo: {
    label: "SHIP TO Section",
    labelFontSize: 8.8,
    addressFontSize: 8.0,
    offsetX: 0,
    offsetY: 0,
    marginTop: 34,
    bold: false,
  },
  trackingHeader: {
    label: "USPS TRACKING # EP",
    fontSize: 10.5,
    offsetX: 0,
    offsetY: 0,
    bold: true,
  },
  barcode: {
    label: "Barcode Image",
    height: 72,
    width: 255,
    offsetX: 0,
    offsetY: 0,
  },
  trackingNumber: {
    label: "Tracking Number Digits",
    fontSize: 12.5,
    offsetX: 0,
    offsetY: 0,
    bold: true,
  },
  description: {
    label: "Bottom Description Text",
    fontSize: 7.2,
    offsetX: 0,
    offsetY: 0,
    bold: true,
    marginTop: 26,
    marginBottom: 26,
  },
};

const COLLECTION = "templateConfigs";
const DOC_ID = "USPS_Ground_Advantage_Cubic_Copy";

/**
 * Load template config from Firestore.
 * Returns merged config (defaults + saved overrides).
 */
export const loadTemplateConfig = async () => {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const saved = docSnap.data();
      // Deep merge: for each component, spread defaults then overrides
      const merged = {};
      for (const key of Object.keys(DEFAULT_CUBIC_COPY_CONFIG)) {
        merged[key] = {
          ...DEFAULT_CUBIC_COPY_CONFIG[key],
          ...(saved[key] || {}),
        };
      }
      return merged;
    }
  } catch (e) {
    console.error("Error loading template config:", e);
  }
  // Return a deep copy of defaults if nothing saved
  return JSON.parse(JSON.stringify(DEFAULT_CUBIC_COPY_CONFIG));
};

/**
 * Save template config to Firestore.
 */
export const saveTemplateConfig = async (config) => {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    await setDoc(docRef, config);
    return true;
  } catch (e) {
    console.error("Error saving template config:", e);
    return false;
  }
};

/**
 * Reset template config by deleting the Firestore doc.
 * Returns the default config.
 */
export const resetTemplateConfig = async () => {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error resetting template config:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CUBIC_COPY_CONFIG));
};
