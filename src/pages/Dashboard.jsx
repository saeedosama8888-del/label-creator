import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import 'flowbite';
import CSVReader from 'react-csv-reader';
import MainDocument from './MainDocument';
import CheckAuth from '../Components/AuthCheck';
import { auth } from '../config/firebase';
import SearchableDropdown from '../Components/SearchableDropdown';

const templateOptions = [
  { value: "UPS Ground 2", label: "UPS Ground 2" },
  { value: "Packing Slip", label: "Packing Slip" },
  { value: "Wallmart USPS Ground Advantage", label: "Wallmart USPS Ground Advantage + Slip" },
  { value: "Wallmart USPS Ground Advantage Copy", label: "Wallmart USPS Ground Advantage Copy" },
  { value: "Wallmart USPS Priority Mail", label: "Wallmart USPS Priority Mail + Slip" },
  { value: "Wallmart USPS Priority Mail Copy", label: "Wallmart USPS Priority Mail Copy" },
  { value: "USPS Ground Advantage 2", label: "Stamp USPS Ground Advantage 2 + Slip" },
  { value: "USPS Ground Advantage 2 Copy", label: "Stamp USPS Ground Advantage 2 Copy" },
  { value: "USPS Ground Advantage 3", label: "USPS.com Ground APIs + Slip" },
  { value: "USPS Ground Advantage 3 Copy", label: "USPS.com Ground APIs Copy" },
  { value: "USPS api priority mail", label: "USPS api priority mail" },
  { value: "USPS api priority mail C1", label: "USPS api priority mail C1" },
  { value: "USPS api priority mail C1 One GS", label: "USPS api priority mail C1 One GS" },
  { value: "Click n ship ground", label: "Click n ship ground" },
  { value: "USPS Ground Pitney Bowes", label: "USPS Ground Pitney Bowes" },
  { value: "USPS Priority Pitney Bowes", label: "USPS Priority Pitney Bowes" },
  { value: "USPS Priority Mail", label: "USPS Priority Mail" },
  { value: "USPS Priority Mail 2", label: "Stamp USPS Priority Mail 2 + Slip" },
  { value: "USPS Priority Mail 2 Copy", label: "Stamp USPS Priority Mail 2 Copy" },
  { value: "USPS Priority Mail 3 e Postage", label: "USPS Priority Mail 3 e Postage + Slip" },
  { value: "USPS Priority Mail 3 e Postage Copy", label: "USPS Priority Mail 3 e Postage Copy" },
  { value: "USPS Priority e postage C1", label: "USPS Priority e postage C1" },
  { value: "USPS Priority e postage C1 No GS", label: "USPS Priority e postage C1 No GS" },
  { value: "UPS 2ND DAY AIR", label: "UPS 2ND DAY AIR" },
  { value: "UPS 2ND DAY AIR 2", label: "UPS 2ND DAY AIR 2" },
  { value: "UPS NEXT DAY AIR", label: "UPS NEXT DAY AIR" },
  { value: "UPS NEXT DAY AIR 2", label: "UPS NEXT DAY AIR 2" },
  { value: "UPS Ground", label: "UPS Ground" },
  { value: "UPS Ground 3", label: "UPS Ground 3" },
  { value: "USPS Ground Advantage", label: "USPS Ground Advantage + Slip" },
  { value: "USPS Ground Advantage Copy", label: "USPS Ground Advantage Copy" },
  { value: "USPS Ground Advantage Cubic", label: "USPS Ground Advantage Cubic" },
  { value: "USPS SCAN Form 5630", label: "USPS SCAN Form 5630 (Acceptance Notice)" },
];

const processCsvData = (rawData) => {
  if (!rawData || rawData.length === 0) return [];

  let headers = [];
  let dataRows = rawData;

  if (Array.isArray(rawData[0])) {
    const firstRowStr = rawData[0].map((cell) => String(cell || "").trim());
    const isHeaderRow = firstRowStr.some(
      (h) => h && isNaN(h) && !/^\d{16,34}$/.test(h)
    );

    if (isHeaderRow) {
      headers = firstRowStr;
      dataRows = rawData.slice(1);
    }
  }

  return dataRows
    .filter((row) => row && (Array.isArray(row) ? row.some((c) => String(c).trim() !== "") : true))
    .map((row) => {
      if (Array.isArray(row)) {
        const rowObj = {};
        // Initialize numeric index properties as empty strings
        for (let i = 0; i < 35; i++) {
          rowObj[i] = "";
        }
        // Keep numeric index lookups for backwards compatibility
        row.forEach((val, idx) => {
          let strVal = String(val ?? "").trim();
          rowObj[idx] = strVal;
        });
        // Map header column names
        headers.forEach((header, idx) => {
          if (header) {
            let strVal = row[idx] !== undefined ? String(row[idx] ?? "").trim() : "";
            rowObj[header] = strVal;
            const trimmed = header.trim();
            rowObj[trimmed] = strVal;
            rowObj[trimmed.toLowerCase()] = strVal;
          }
        });
        return rowObj;
      }
      return row;
    });
};

function Dashboard() {
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [cvsFileName, setCvsFileName] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {}
  };

  return (
    <CheckAuth>
      <nav className="w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 max-w-full lg:w-[80%] sm:w-[85%] w-full mx-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start rtl:justify-end">
              <a href="/" className="flex ms-2 md:me-24">
                <p className="self-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 text-lg font-bold sm:text-2xl whitespace-nowrap">
                  Shipping Label Creation
                </p>
              </a>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-8 flex flex-col justify-center w-full max-w-full lg:w-[80%] sm:w-[85%] lg:px-3 sm:px-0 px-4 mx-auto">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-36 rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-300 hover:border-gray-400 border-dashed cursor-pointer"
        >
          <CSVReader
            cssclassName="mx-auto m-0 p-0"
            parserOptions={{
              dynamicTyping: false,
              skipEmptyLines: true,
            }}
            onFileLoaded={(data, fileInfo) => {
              const processed = processCsvData(data);
              setCsvData(processed);
              let name = fileInfo.name?.replace(".csv", "");
              setCvsFileName(name);
              setSelectedOption("");
            }}
          />
        </label>
        <div>
          {csvData?.length > 0 && csvData && (
            <>
              <div className="my-4 w-full sm:w-[500px]">
                <SearchableDropdown
                  options={templateOptions}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  placeholder="Choose a template"
                />
              </div>
            </>
          )}
        </div>
      </div>
      {selectedOption && (
        <MainDocument
          key={`${selectedOption}-${csvData?.length}-${cvsFileName}`}
          csvData={csvData}
          cvsFileName={cvsFileName}
          selectedOption={selectedOption}
        />
      )}
    </CheckAuth>
  );
}

export default Dashboard;
