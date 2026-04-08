import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

//types

type Category = "Distance" | "Volume" | "Area" | "Temperature";
type PickerTarget = "from" | "to" | null;

interface CategoryConfig {
  units: string[];
  toBase: Record<string, (v: number) => number>;
  fromBase: Record<string, (v: number) => number>;
}

//logic

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

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: Category,
): number {
  const cat = CONVERSIONS[category];
  if (!cat) return NaN;
  return cat.fromBase[toUnit](cat.toBase[fromUnit](value));
}

export function formatResult(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e9 || (abs < 0.0001 && abs > 0)) return value.toExponential(4);
  if (abs >= 100) return parseFloat(value.toPrecision(7)).toString();
  return parseFloat(value.toPrecision(7)).toString();
}

//unit picker

interface UnitPickerProps {
  visible: boolean;
  units: string[];
  selected: string;
  title: string;
  onSelect: (unit: string) => void;
  onClose: () => void;
}

function UnitPicker({
  visible,
  units,
  selected,
  title,
  onSelect,
  onClose,
}: UnitPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable className="bg-[#222] rounded-t-3xl pb-10" onPress={() => {}}>
          <View className="w-10 h-1 bg-[#555] rounded-full mx-auto mt-3 mb-4" />
          <Text className="text-white font-semibold text-base px-5 pb-3 border-b border-[#333]">
            {title}
          </Text>
          <ScrollView>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit}
                className="px-5 py-4 border-b border-[#2a2a2a]"
                onPress={() => {
                  onSelect(unit);
                  onClose();
                }}
              >
                <Text
                  className={`text-base ${unit === selected ? "text-[#5B6FFF] font-semibold" : "text-white font-normal"}`}
                >
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

// screen

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

  const handleConvert = useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;
    setResult(convert(val, fromUnit, toUnit, category));
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null) {
      setInputValue(formatResult(result));
      setResult(convert(result, toUnit, fromUnit, category));
    }
  }, [fromUnit, toUnit, result, category]);

  const displayResult =
    result !== null ? formatResult(result) : inputValue ? "—" : "0";

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-3">
        <TouchableOpacity>
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-[#5B6FFF] text-base font-semibold">
          SmartCalc
        </Text>
      </View>

      {/* Page title */}
      <Text className="text-white text-3xl font-bold px-5 pt-2 pb-4 tracking-tight">
        Convert
      </Text>

      <View className="flex-1 px-4 gap-3">
        {/* Input card */}
        <View className="bg-[#2c2c2c] rounded-2xl px-5 py-4">
          <TextInput
            className="text-white text-3xl font-medium tracking-tight"
            value={inputValue}
            onChangeText={(v) => {
              if (/^-?\d*\.?\d*$/.test(v) || v === "" || v === "-") {
                setInputValue(v);
                setResult(null);
              }
            }}
            placeholder="0"
            placeholderTextColor="#555"
            keyboardType="numeric"
          />
          <Text className="text-[#888] text-sm mt-1">{fromUnit}</Text>
        </View>

        {/* Output card */}
        <View className="bg-[#2c2c2c] rounded-2xl px-5 py-4">
          <Text className="text-white text-3xl font-medium tracking-tight min-h-[36px]">
            {displayResult}
          </Text>
          <Text className="text-[#888] text-sm mt-1">{toUnit}</Text>
        </View>

        {/* Unit selector row */}
        <View className="bg-[#2c2c2c] rounded-2xl px-4 py-3 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setPicker("from")}>
            <Text className="text-white text-base font-medium">{fromUnit}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#3a3a3a] rounded-lg w-9 h-9 items-center justify-center"
            onPress={handleSwap}
          >
            <Text className="text-white text-base">⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPicker("to")}>
            <Text className="text-white text-base font-medium">{toUnit}</Text>
          </TouchableOpacity>
        </View>

        {/* Convert button */}
        <TouchableOpacity
          className="bg-[#5B6FFF] rounded-2xl py-4 items-center mt-1 active:opacity-80"
          onPress={handleConvert}
        >
          <Text className="text-white text-lg font-semibold">Convert</Text>
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <View className="flex-row flex-wrap gap-2.5 px-4 mt-3 mb-2">
        {(Object.keys(CONVERSIONS) as Category[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`py-3 rounded-xl items-center border flex-1 basis-[45%] ${
              cat === category
                ? "bg-[#2c2c2c] border-[#5B6FFF]"
                : "bg-transparent border-[#3a3a3a]"
            }`}
            onPress={() => handleCategoryChange(cat)}
          >
            <Text
              className={`text-sm font-medium ${
                cat === category ? "text-white" : "text-[#888]"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Unit picker modal */}
      <UnitPicker
        visible={picker !== null}
        units={units}
        selected={picker === "from" ? fromUnit : toUnit}
        title={`Select ${picker === "from" ? "from" : "to"} unit`}
        onSelect={(u) => (picker === "from" ? setFromUnit(u) : setToUnit(u))}
        onClose={() => setPicker(null)}
      />
    </SafeAreaView>
  );
}
