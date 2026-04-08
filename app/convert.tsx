import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { saveHistory } from "../utils/storage";

type Category = "Distance" | "Volume" | "Area" | "Temperature";
type PickerTarget = "from" | "to" | null;

interface CategoryConfig {
  units: string[];
  toBase: Record<string, (v: number) => number>;
  fromBase: Record<string, (v: number) => number>;
}

const CONVERSIONS: Record<Category, CategoryConfig> = {
  Distance: {
    units: [
      "Kilometer",
      "Mile",
      "Meter",
      "Foot",
      "Inch",
      "Yard",
      "Centimeter",
      "Nautical Mile",
    ],
    toBase: {
      Kilometer: (v) => v * 1000,
      Mile: (v) => v * 1609.344,
      Meter: (v) => v,
      Foot: (v) => v * 0.3048,
      Inch: (v) => v * 0.0254,
      Yard: (v) => v * 0.9144,
      Centimeter: (v) => v * 0.01,
      "Nautical Mile": (v) => v * 1852,
    },
    fromBase: {
      Kilometer: (v) => v / 1000,
      Mile: (v) => v / 1609.344,
      Meter: (v) => v,
      Foot: (v) => v / 0.3048,
      Inch: (v) => v / 0.0254,
      Yard: (v) => v / 0.9144,
      Centimeter: (v) => v / 0.01,
      "Nautical Mile": (v) => v / 1852,
    },
  },
  Volume: {
    units: [
      "Liter",
      "Milliliter",
      "Gallon (US)",
      "Gallon (UK)",
      "Cup",
      "Fluid Ounce",
      "Tablespoon",
      "Teaspoon",
    ],
    toBase: {
      Liter: (v) => v,
      Milliliter: (v) => v / 1000,
      "Gallon (US)": (v) => v * 3.78541,
      "Gallon (UK)": (v) => v * 4.54609,
      Cup: (v) => v * 0.236588,
      "Fluid Ounce": (v) => v * 0.0295735,
      Tablespoon: (v) => v * 0.0147868,
      Teaspoon: (v) => v * 0.00492892,
    },
    fromBase: {
      Liter: (v) => v,
      Milliliter: (v) => v * 1000,
      "Gallon (US)": (v) => v / 3.78541,
      "Gallon (UK)": (v) => v / 4.54609,
      Cup: (v) => v / 0.236588,
      "Fluid Ounce": (v) => v / 0.0295735,
      Tablespoon: (v) => v / 0.0147868,
      Teaspoon: (v) => v / 0.00492892,
    },
  },
  Area: {
    units: [
      "Square Meter",
      "Square Kilometer",
      "Square Mile",
      "Square Foot",
      "Square Inch",
      "Acre",
      "Hectare",
      "Square Yard",
    ],
    toBase: {
      "Square Meter": (v) => v,
      "Square Kilometer": (v) => v * 1e6,
      "Square Mile": (v) => v * 2589988.1103,
      "Square Foot": (v) => v * 0.092903,
      "Square Inch": (v) => v * 0.00064516,
      Acre: (v) => v * 4046.856422,
      Hectare: (v) => v * 10000,
      "Square Yard": (v) => v * 0.836127,
    },
    fromBase: {
      "Square Meter": (v) => v,
      "Square Kilometer": (v) => v / 1e6,
      "Square Mile": (v) => v / 2589988.1103,
      "Square Foot": (v) => v / 0.092903,
      "Square Inch": (v) => v / 0.00064516,
      Acre: (v) => v / 4046.856422,
      Hectare: (v) => v / 10000,
      "Square Yard": (v) => v / 0.836127,
    },
  },
  Temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
    toBase: {
      Celsius: (v) => v,
      Fahrenheit: (v) => (v - 32) * (5 / 9),
      Kelvin: (v) => v - 273.15,
      Rankine: (v) => (v - 491.67) * (5 / 9),
    },
    fromBase: {
      Celsius: (v) => v,
      Fahrenheit: (v) => v * (9 / 5) + 32,
      Kelvin: (v) => v + 273.15,
      Rankine: (v) => (v + 273.15) * (9 / 5),
    },
  },
};

function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: Category
): number {
  const cat = CONVERSIONS[category];
  if (!cat) return NaN;
  return cat.fromBase[toUnit](cat.toBase[fromUnit](value));
}

function formatResult(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e9 || (abs < 0.0001 && abs > 0)) return value.toExponential(4);
  if (abs >= 100) return parseFloat(value.toPrecision(7)).toString();
  return parseFloat(value.toPrecision(7)).toString();
}

function UnitPicker({
  visible,
  units,
  selected,
  title,
  onSelect,
  onClose,
}: {
  visible: boolean;
  units: string[];
  selected: string;
  title: string;
  onSelect: (unit: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={styles.unitRow}
                onPress={() => {
                  onSelect(unit);
                  onClose();
                }}
              >
                <Text style={[styles.unitText, unit === selected && styles.selectedUnitText]}>
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ConversionScreen() {
  const [category, setCategory] = useState<Category>("Distance");
  const [fromUnit, setFromUnit] = useState<string>("Kilometer");
  const [toUnit, setToUnit] = useState<string>("Mile");
  const [inputValue, setInputValue] = useState<string>("10");
  const [result, setResult] = useState<number | null>(null);
  const [picker, setPicker] = useState<PickerTarget>(null);

  const units = CONVERSIONS[category].units;

  const handleCategoryChange = useCallback((cat: Category) => {
    setCategory(cat);
    const defaultUnits = CONVERSIONS[cat].units;
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1]);
    setResult(null);
    setInputValue("");
  }, []);

  const handleConvert = useCallback(async () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    const convertedValue = convert(val, fromUnit, toUnit, category);
    setResult(convertedValue);

    await saveHistory(
      val + " " + fromUnit + " → " + toUnit + " = " + formatResult(convertedValue)
    );
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  }, [fromUnit, toUnit]);

  const handleKeyPress = (value: string) => {
    if (value === ".") {
      if (inputValue.includes(".")) return;
      setInputValue(inputValue === "" ? "0." : inputValue + ".");
      return;
    }

    if (inputValue === "0") {
      setInputValue(value);
    } else {
      setInputValue(inputValue + value);
    }
    setResult(null);
  };

  const handleDelete = () => {
    if (inputValue.length <= 1) {
      setInputValue("");
    } else {
      setInputValue(inputValue.slice(0, -1));
    }
    setResult(null);
  };

  const handleClear = () => {
    setInputValue("");
    setResult(null);
  };

  const displayResult =
    result !== null ? formatResult(result) : inputValue ? "—" : "0";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>SmartCalc</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <Text style={styles.screenTitle}>Convert</Text>

      <View style={styles.card}>
        <Text style={styles.inputText}>{inputValue === "" ? "0" : inputValue}</Text>
        <Text style={styles.unitLabel}>{fromUnit}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.resultValue}>{displayResult}</Text>
        <Text style={styles.unitLabel}>{toUnit}</Text>
      </View>

      <View style={styles.unitSwapRow}>
        <TouchableOpacity onPress={() => setPicker("from")}>
          <Text style={styles.swapUnitText}>{fromUnit}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapButtonText}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPicker("to")}>
          <Text style={styles.swapUnitText}>{toUnit}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
        <Text style={styles.convertButtonText}>Convert</Text>
      </TouchableOpacity>

      <View style={styles.categoryGrid}>
        {(Object.keys(CONVERSIONS) as Category[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              cat === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryChange(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                cat === category && styles.categoryButtonTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <KeyBtn text="7" onPress={() => handleKeyPress("7")} />
          <KeyBtn text="8" onPress={() => handleKeyPress("8")} />
          <KeyBtn text="9" onPress={() => handleKeyPress("9")} />
          <KeyBtn text="DEL" onPress={handleDelete} special />
        </View>

        <View style={styles.row}>
          <KeyBtn text="4" onPress={() => handleKeyPress("4")} />
          <KeyBtn text="5" onPress={() => handleKeyPress("5")} />
          <KeyBtn text="6" onPress={() => handleKeyPress("6")} />
          <KeyBtn text="C" onPress={handleClear} special />
        </View>

        <View style={styles.row}>
          <KeyBtn text="1" onPress={() => handleKeyPress("1")} />
          <KeyBtn text="2" onPress={() => handleKeyPress("2")} />
          <KeyBtn text="3" onPress={() => handleKeyPress("3")} />
          <KeyBtn text="." onPress={() => handleKeyPress(".")} />
        </View>

        <View style={styles.row}>
          <KeyBtn text="0" wide onPress={() => handleKeyPress("0")} />
        </View>
      </View>

      <UnitPicker
        visible={picker !== null}
        units={units}
        selected={picker === "from" ? fromUnit : toUnit}
        title={`Select ${picker === "from" ? "from" : "to"} unit`}
        onSelect={(u) => (picker === "from" ? setFromUnit(u) : setToUnit(u))}
        onClose={() => setPicker(null)}
      />
    </ScrollView>
  );
}

function KeyBtn({
  text,
  onPress,
  special,
  wide,
}: {
  text: string;
  onPress: () => void;
  special?: boolean;
  wide?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.keyButton,
        special && styles.specialKeyButton,
        wide && styles.wideKeyButton,
      ]}
    >
      <Text style={styles.keyButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111216",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  appTitle: {
    color: "#7D8CFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  rightPlaceholder: {
    width: 22,
  },
  screenTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1F222A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  inputText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "500",
  },
  resultValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "500",
  },
  unitLabel: {
    color: "#7A7D85",
    fontSize: 14,
    marginTop: 6,
  },
  unitSwapRow: {
    backgroundColor: "#1F222A",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  swapUnitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  swapButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#3B3E46",
    justifyContent: "center",
    alignItems: "center",
  },
  swapButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  convertButton: {
    backgroundColor: "#4F67FF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  convertButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryButton: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: "#1F222A",
    borderWidth: 1,
    borderColor: "#3B3E46",
    alignItems: "center",
  },
  categoryButtonActive: {
    borderColor: "#4F67FF",
  },
  categoryButtonText: {
    color: "#8A8A8F",
    fontSize: 15,
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  keypad: {
    backgroundColor: "#181B22",
    borderRadius: 24,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  keyButton: {
    width: 74,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#3B3E46",
    justifyContent: "center",
    alignItems: "center",
  },
  specialKeyButton: {
    backgroundColor: "#5F7885",
  },
  wideKeyButton: {
    width: "100%",
  },
  keyButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#1F222A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  unitRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  unitText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  selectedUnitText: {
    color: "#4F67FF",
    fontWeight: "bold",
  },
});