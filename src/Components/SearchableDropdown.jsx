import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({ options, value, onChange, placeholder = "Choose an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyCopy, setShowOnlyCopy] = useState(false);
  const [showOnlyUSPS, setShowOnlyUSPS] = useState(false);
  const [showOnlyUPS, setShowOnlyUPS] = useState(false);
  const [showOnlySlip, setShowOnlySlip] = useState(false);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Toggle USPS carrier filter (mutually exclusive with UPS)
  const toggleUSPS = () => {
    setShowOnlyUSPS(!showOnlyUSPS);
    if (!showOnlyUSPS) {
      setShowOnlyUPS(false);
    }
  };

  // Toggle UPS carrier filter (mutually exclusive with USPS)
  const toggleUPS = () => {
    setShowOnlyUPS(!showOnlyUPS);
    if (!showOnlyUPS) {
      setShowOnlyUSPS(false);
    }
  };

  const isAllActive = !showOnlyCopy && !showOnlyUSPS && !showOnlyUPS && !showOnlySlip;

  const clearAllFilters = () => {
    setShowOnlyCopy(false);
    setShowOnlyUSPS(false);
    setShowOnlyUPS(false);
    setShowOnlySlip(false);
  };

  // Filter based on search term AND chosen chips
  const filteredOptions = options.filter((opt) => {
    const matchesSearch =
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCopy =
      !showOnlyCopy ||
      opt.label.toLowerCase().includes("copy") ||
      opt.value.toLowerCase().includes("copy");

    const matchesUSPS =
      !showOnlyUSPS ||
      opt.label.toLowerCase().includes("usps") ||
      opt.value.toLowerCase().includes("usps");

    const matchesUPS =
      !showOnlyUPS ||
      opt.label.toLowerCase().includes("ups") ||
      opt.value.toLowerCase().includes("ups");

    const matchesSlip =
      !showOnlySlip ||
      opt.label.toLowerCase().includes("slip") ||
      opt.value.toLowerCase().includes("slip");

    return matchesSearch && matchesCopy && matchesUSPS && matchesUPS && matchesSlip;
  });

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderLabel = (label) => {
    if (typeof label === "string" && label.includes(" + Slip")) {
      const baseLabel = label.replace(" + Slip", "");
      return (
        <>
          {baseLabel}
          <span className="font-semibold text-gray-900 dark:text-gray-100"> + Slip</span>
        </>
      );
    }
    return label;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        Select a template
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span className={selectedOption ? "font-medium" : "text-gray-400"}>
          {selectedOption ? renderLabel(selectedOption.label) : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 ease-out transform origin-top scale-100 opacity-100">
          {/* Search & Filter Container */}
          <div className="sticky top-0 z-10 p-2.5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 rounded-t-lg">
            <div className="relative flex items-center mb-2">
              <svg
                className="absolute left-3 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-8 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Filter Toggle Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700">
              {/* All Chip */}
              <button
                type="button"
                onClick={clearAllFilters}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all border flex items-center gap-1.5 ${
                  isAllActive
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${isAllActive ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"}`}
                />
                All
              </button>

              {/* Copies Chip */}
              <button
                type="button"
                onClick={() => setShowOnlyCopy(!showOnlyCopy)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all border flex items-center gap-1.5 ${
                  showOnlyCopy
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${showOnlyCopy ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"}`}
                />
                Copies
              </button>

              {/* Slips Chip */}
              <button
                type="button"
                onClick={() => setShowOnlySlip(!showOnlySlip)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all border flex items-center gap-1.5 ${
                  showOnlySlip
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${showOnlySlip ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"}`}
                />
                Slips
              </button>

              {/* USPS Chip */}
              <button
                type="button"
                onClick={toggleUSPS}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all border flex items-center gap-1.5 ${
                  showOnlyUSPS
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${showOnlyUSPS ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"}`}
                />
                USPS
              </button>

              {/* UPS Chip */}
              <button
                type="button"
                onClick={toggleUPS}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all border flex items-center gap-1.5 ${
                  showOnlyUPS
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${showOnlyUPS ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"}`}
                />
                UPS
              </button>
            </div>
          </div>

          {/* Options List */}
          <ul className="min-h-[250px] max-h-96 overflow-y-auto py-1 text-sm text-gray-700 dark:text-gray-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      option.value === value
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <span>{renderLabel(option.label)}</span>
                    {option.value === value && (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                No templates match your filters.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
