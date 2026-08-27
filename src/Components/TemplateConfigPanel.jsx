import { useState } from "react";
import {
  saveTemplateConfig,
  resetTemplateConfig,
  DEFAULT_CUBIC_COPY_CONFIG,
} from "../config/templateConfigService";

// A single number input with +/- stepper
const NumberStepper = ({ label, value, onChange, step = 0.5, min, max }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-700 dark:text-gray-300 w-24">{label}</span>
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.round((value - step) * 10) / 10)}
        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-bold"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        className="w-16 text-center text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white py-1"
      />
      <button
        type="button"
        onClick={() => onChange(Math.round((value + step) * 10) / 10)}
        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-bold"
      >
        +
      </button>
    </div>
  </div>
);

// Bold toggle switch
const BoldToggle = ({ value, onChange }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-700 dark:text-gray-300 w-24">Bold</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          value ? "translate-x-5" : ""
        }`}
      />
    </button>
  </div>
);

// Accordion section for a single component
const ConfigSection = ({ sectionKey, config, defaults, onChange, openSection, setOpenSection }) => {
  const isOpen = openSection === sectionKey;
  const sectionConfig = config[sectionKey];
  const sectionDefaults = defaults[sectionKey];

  const update = (field, value) => {
    onChange(sectionKey, { ...sectionConfig, [field]: value });
  };

  // Check if any value differs from defaults
  const hasChanges = Object.keys(sectionDefaults).some(
    (key) => key !== "label" && sectionConfig[key] !== sectionDefaults[key]
  );

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        className="flex items-center justify-between w-full py-2.5 px-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          {sectionConfig.label}
          {hasChanges && (
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" title="Modified" />
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-1">
          {/* Font Size — present on all except barcode */}
          {sectionConfig.fontSize !== undefined && (
            <NumberStepper label="Font Size" value={sectionConfig.fontSize} onChange={(v) => update("fontSize", v)} step={0.5} />
          )}
          {/* Label Font Size — shipTo only */}
          {sectionConfig.labelFontSize !== undefined && (
            <NumberStepper label="Label Size" value={sectionConfig.labelFontSize} onChange={(v) => update("labelFontSize", v)} step={0.5} />
          )}
          {/* Address Font Size — shipTo only */}
          {sectionConfig.addressFontSize !== undefined && (
            <NumberStepper label="Addr Size" value={sectionConfig.addressFontSize} onChange={(v) => update("addressFontSize", v)} step={0.5} />
          )}
          {/* TM Font Size — banner only */}
          {sectionConfig.tmFontSize !== undefined && (
            <NumberStepper label="TM Size" value={sectionConfig.tmFontSize} onChange={(v) => update("tmFontSize", v)} step={0.5} />
          )}
          {/* Box Width — postageBox only */}
          {sectionConfig.boxWidth !== undefined && (
            <NumberStepper label="Box Width" value={sectionConfig.boxWidth} onChange={(v) => update("boxWidth", v)} step={1} />
          )}
          {/* Height — barcode only */}
          {sectionConfig.height !== undefined && (
            <NumberStepper label="Height" value={sectionConfig.height} onChange={(v) => update("height", v)} step={1} />
          )}
          {/* Width — barcode only */}
          {sectionConfig.width !== undefined && (
            <NumberStepper label="Width" value={sectionConfig.width} onChange={(v) => update("width", v)} step={1} />
          )}
          {/* Margin Top — shipTo, description */}
          {sectionConfig.marginTop !== undefined && (
            <NumberStepper label="Margin Top" value={sectionConfig.marginTop} onChange={(v) => update("marginTop", v)} step={1} />
          )}
          {/* Margin Bottom — description only */}
          {sectionConfig.marginBottom !== undefined && (
            <NumberStepper label="Margin Btm" value={sectionConfig.marginBottom} onChange={(v) => update("marginBottom", v)} step={1} />
          )}
          {/* Margin Right — cubicText, postageBox */}
          {sectionConfig.marginRight !== undefined && (
            <NumberStepper label="Margin Right" value={sectionConfig.marginRight} onChange={(v) => update("marginRight", v)} step={1} />
          )}
          {/* Offset X & Y — all components */}
          <NumberStepper label="Offset X" value={sectionConfig.offsetX} onChange={(v) => update("offsetX", v)} step={1} />
          <NumberStepper label="Offset Y" value={sectionConfig.offsetY} onChange={(v) => update("offsetY", v)} step={1} />
          {/* Bold toggle — all except barcode */}
          {sectionConfig.bold !== undefined && (
            <BoldToggle value={sectionConfig.bold} onChange={(v) => update("bold", v)} />
          )}
        </div>
      )}
    </div>
  );
};

const SECTION_KEYS = [
  "gLogo",
  "cubicText",
  "postageBox",
  "banner",
  "senderAddress",
  "dateWeight",
  "shipTo",
  "trackingHeader",
  "barcode",
  "trackingNumber",
  "description",
];

const TemplateConfigPanel = ({ config, onConfigChange, onClose }) => {
  const [openSection, setOpenSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleSectionChange = (sectionKey, sectionValue) => {
    onConfigChange({ ...config, [sectionKey]: sectionValue });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("");
    const success = await saveTemplateConfig(config);
    setSaving(false);
    setSaveStatus(success ? "✓ Saved!" : "✗ Error saving");
    if (success) {
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const handleReset = async () => {
    const defaults = await resetTemplateConfig();
    onConfigChange(defaults);
    setSaveStatus("Reset to defaults");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          ⚙️ Template Config
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          ✕
        </button>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        {SECTION_KEYS.map((key) => (
          <ConfigSection
            key={key}
            sectionKey={key}
            config={config}
            defaults={DEFAULT_CUBIC_COPY_CONFIG}
            onChange={handleSectionChange}
            openSection={openSection}
            setOpenSection={setOpenSection}
          />
        ))}
      </div>

      {/* Footer with Save / Reset */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2">
        {saveStatus && (
          <p className="text-xs text-center text-gray-600 dark:text-gray-400">{saveStatus}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateConfigPanel;
