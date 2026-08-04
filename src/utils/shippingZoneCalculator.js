class ShippingZoneCalculator {
  constructor() {
    this.zipPrefixRegions = {
      // Northeast Region
      "00": "PR",
      "01": "MA",
      "02": "MA",
      "03": "NH",
      "04": "ME",
      "05": "VT",
      "06": "CT",
      "07": "NJ",
      "08": "NJ",
      "09": "AE",

      // Mid-Atlantic Region
      10: "NY",
      11: "NY",
      12: "NY",
      13: "NY",
      14: "NY",
      15: "PA",
      16: "PA",
      17: "PA",
      18: "PA",
      19: "PA",

      // South Region
      20: "DC",
      21: "MD",
      22: "VA",
      23: "VA",
      24: "WV",
      25: "WV",
      26: "WV",
      27: "NC",
      28: "NC",
      29: "SC",
      30: "GA",
      31: "GA",
      32: "FL",
      33: "FL",
      34: "FL",
      35: "AL",
      36: "AL",
      37: "TN",
      38: "TN",
      39: "MS",

      // Midwest Region
      40: "KY",
      41: "KY",
      42: "KY",
      43: "OH",
      44: "OH",
      45: "OH",
      46: "IN",
      47: "IN",
      48: "MI",
      49: "MI",
      50: "IA",
      51: "IA",
      52: "IA",
      53: "WI",
      54: "WI",
      55: "MN",
      56: "MN",
      57: "SD",
      58: "ND",
      59: "ND",

      // Central Region
      60: "IL",
      61: "IL",
      62: "IL",
      63: "MO",
      64: "MO",
      65: "MO",
      66: "KS",
      67: "KS",
      68: "NE",
      69: "NE",
      70: "LA",
      71: "LA",
      72: "AR",
      73: "OK",
      74: "OK",
      75: "TX",
      76: "TX",
      77: "TX",
      78: "TX",
      79: "TX",

      // Mountain Region
      80: "CO",
      81: "CO",
      82: "WY",
      83: "WY",
      84: "UT",
      85: "AZ",
      86: "AZ",
      87: "NM",
      88: "NM",
      89: "NV",

      // Pacific Region
      90: "CA",
      91: "CA",
      92: "CA",
      93: "CA",
      94: "CA",
      95: "CA",
      96: "AP",
      97: "OR",
      98: "WA",
      99: "AK",
    };

    // Regional zones (simplified)
    this.regionGroups = {
      Northeast: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
      "NY-PA": ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
      MidAtlantic: ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"],
      Southeast: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39"],
      Midwest: ["40", "41", "42", "43", "44", "45", "46", "47", "48", "49"],
      NorthCentral: [
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
      Central: ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69"],
      SouthCentral: [
        "70",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "78",
        "79",
      ],
      Mountain: ["80", "81", "82", "83", "84", "85", "86", "87", "88", "89"],
      Pacific: ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99"],
    };
  }

  getRegion(prefix) {
    for (const [region, prefixes] of Object.entries(this.regionGroups)) {
      if (prefixes.includes(prefix)) {
        return region;
      }
    }
    return null;
  }

  calculateZone(fromZip, toZip) {
    try {
      // Clean and normalize ZIP codes
      let fromZipStr = String(fromZip || "")
        .trim()
        .replace(/\D/g, "");
      let toZipStr = String(toZip || "")
        .trim()
        .replace(/\D/g, "");

      // IMPORTANT: Handle ZIP codes that may have lost leading zeros
      // If ZIP is less than 5 digits, pad with leading zeros
      if (fromZipStr.length < 5 && fromZipStr.length > 0) {
        fromZipStr = fromZipStr.padStart(5, "0");
      }
      if (toZipStr.length < 5 && toZipStr.length > 0) {
        toZipStr = toZipStr.padStart(5, "0");
      }

      // Validate ZIP codes
      if (
        !fromZipStr ||
        !toZipStr ||
        fromZipStr.length < 3 ||
        toZipStr.length < 3
      ) {
        console.warn("Invalid ZIP codes:", { fromZip, toZip });
        return 5; // Default zone
      }

      // Extract first 2 digits
      const fromPrefix = fromZipStr.substring(0, 2);
      const toPrefix = toZipStr.substring(0, 2);

      // console.log('Zone calculation:', {
      //     fromZip: fromZip,
      //     toZip: toZip,
      //     fromPrefix: fromPrefix,
      //     toPrefix: toPrefix,
      //     fromRegion: this.getRegion(fromPrefix),
      //     toRegion: this.getRegion(toPrefix)
      // });

      // Same prefix = local zone
      if (fromPrefix === toPrefix) {
        return 1;
      }

      const fromRegion = this.getRegion(fromPrefix);
      const toRegion = this.getRegion(toPrefix);

      // Zone mapping based on regions
      const zoneMap = {
        Northeast: {
          Northeast: 2,
          "NY-PA": 3,
          MidAtlantic: 4,
          Southeast: 5,
          Midwest: 5,
          NorthCentral: 6,
          Central: 6,
          SouthCentral: 7,
          Mountain: 8,
          Pacific: 8,
        },
        "NY-PA": {
          Northeast: 3,
          "NY-PA": 2,
          MidAtlantic: 3,
          Southeast: 4,
          Midwest: 4,
          NorthCentral: 5,
          Central: 5,
          SouthCentral: 6,
          Mountain: 7,
          Pacific: 8,
        },
        MidAtlantic: {
          Northeast: 4,
          "NY-PA": 3,
          MidAtlantic: 2,
          Southeast: 3,
          Midwest: 4,
          NorthCentral: 5,
          Central: 5,
          SouthCentral: 5,
          Mountain: 7,
          Pacific: 8,
        },
        Southeast: {
          Northeast: 5,
          "NY-PA": 4,
          MidAtlantic: 3,
          Southeast: 2,
          Midwest: 4,
          NorthCentral: 5,
          Central: 5,
          SouthCentral: 4,
          Mountain: 6,
          Pacific: 7,
        },
        Midwest: {
          Northeast: 5,
          "NY-PA": 4,
          MidAtlantic: 4,
          Southeast: 4,
          Midwest: 2,
          NorthCentral: 3,
          Central: 3,
          SouthCentral: 4,
          Mountain: 5,
          Pacific: 7,
        },
        NorthCentral: {
          Northeast: 6,
          "NY-PA": 5,
          MidAtlantic: 5,
          Southeast: 5,
          Midwest: 3,
          NorthCentral: 2,
          Central: 3,
          SouthCentral: 4,
          Mountain: 4,
          Pacific: 6,
        },
        Central: {
          Northeast: 6,
          "NY-PA": 5,
          MidAtlantic: 5,
          Southeast: 5,
          Midwest: 3,
          NorthCentral: 3,
          Central: 2,
          SouthCentral: 3,
          Mountain: 4,
          Pacific: 6,
        },
        SouthCentral: {
          Northeast: 7,
          "NY-PA": 6,
          MidAtlantic: 5,
          Southeast: 4,
          Midwest: 4,
          NorthCentral: 4,
          Central: 3,
          SouthCentral: 2,
          Mountain: 4,
          Pacific: 5,
        },
        Mountain: {
          Northeast: 8,
          "NY-PA": 7,
          MidAtlantic: 7,
          Southeast: 6,
          Midwest: 5,
          NorthCentral: 4,
          Central: 4,
          SouthCentral: 4,
          Mountain: 2,
          Pacific: 3,
        },
        Pacific: {
          Northeast: 8,
          "NY-PA": 8,
          MidAtlantic: 8,
          Southeast: 7,
          Midwest: 7,
          NorthCentral: 6,
          Central: 6,
          SouthCentral: 5,
          Mountain: 3,
          Pacific: 2,
        },
      };

      if (fromRegion && toRegion && zoneMap[fromRegion]) {
        const zone = zoneMap[fromRegion][toRegion];
        // console.log(`Zone result: ${zone} (${fromRegion} to ${toRegion})`);
        return zone || 8;
      }

      // Fallback calculation
      const fromNum = parseInt(fromPrefix);
      const toNum = parseInt(toPrefix);
      const diff = Math.abs(fromNum - toNum);

      let fallbackZone;
      if (diff <= 5) fallbackZone = 2;
      else if (diff <= 10) fallbackZone = 3;
      else if (diff <= 20) fallbackZone = 4;
      else if (diff <= 30) fallbackZone = 5;
      else if (diff <= 45) fallbackZone = 6;
      else if (diff <= 60) fallbackZone = 7;
      else fallbackZone = 8;

      //   console.log(`Using fallback zone: ${fallbackZone} (diff: ${diff})`);
      return fallbackZone;
    } catch (error) {
      console.error("Error calculating zone:", error);
      return 5;
    }
  }
}

const shippingZoneCalculator = new ShippingZoneCalculator();

export default shippingZoneCalculator;
