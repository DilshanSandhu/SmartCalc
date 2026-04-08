import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { saveHistory } from "../utils/storage";

export default function ScientificScreen() {
  const [display, setDisplay] = useState("0");

  const handlePress = (value: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleDelete = () => {
    if (display.length === 1 || display === "Error") {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleEqual = async () => {
    try {
      const expression = display.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(expression);

      await saveHistory(display + " = " + result);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const handleScientific = async (func: string) => {
    try {
      const num = parseFloat(display);

      if (isNaN(num)) {
        setDisplay("Error");
        return;
      }

      const toRadians = (deg: number) => (deg * Math.PI) / 180;

      let result: number;

      switch (func) {
        case "sin":
          result = Math.sin(toRadians(num));
          break;
        case "cos":
          result = Math.cos(toRadians(num));
          break;
        case "tan":
          result = Math.tan(toRadians(num));
          break;
        case "log":
          result = Math.log10(num);
          break;
        case "ln":
          result = Math.log(num);
          break;
        case "√":
          result = Math.sqrt(num);
          break;
        case "x²":
          result = Math.pow(num, 2);
          break;
        case "π":
          result = Math.PI;
          break;
        default:
          result = num;
      }

      await saveHistory(func + "(" + display + ") = " + result);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const renderButton = (
    label: string,
    onPress: () => void,
    styleType: "number" | "operator" | "scientific" | "action" = "number"
  ) => (
    <TouchableOpacity
      style={[
        styles.button,
        styleType === "operator" && styles.operatorButton,
        styleType === "scientific" && styles.scientificButton,
        styleType === "action" && styles.actionButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SmartCalc</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <Text style={styles.screenTitle}>Scientific</Text>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.row}>
        {renderButton("sin", () => handleScientific("sin"), "scientific")}
        {renderButton("cos", () => handleScientific("cos"), "scientific")}
        {renderButton("tan", () => handleScientific("tan"), "scientific")}
        {renderButton("log", () => handleScientific("log"), "scientific")}
      </View>

      <View style={styles.row}>
        {renderButton("ln", () => handleScientific("ln"), "scientific")}
        {renderButton("√", () => handleScientific("√"), "scientific")}
        {renderButton("x²", () => handleScientific("x²"), "scientific")}
        {renderButton("π", () => handleScientific("π"), "scientific")}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          {renderButton("7", () => handlePress("7"))}
          {renderButton("8", () => handlePress("8"))}
          {renderButton("9", () => handlePress("9"))}
          {renderButton("÷", () => handlePress("÷"), "operator")}
        </View>

        <View style={styles.row}>
          {renderButton("4", () => handlePress("4"))}
          {renderButton("5", () => handlePress("5"))}
          {renderButton("6", () => handlePress("6"))}
          {renderButton("×", () => handlePress("×"), "operator")}
        </View>

        <View style={styles.row}>
          {renderButton("1", () => handlePress("1"))}
          {renderButton("2", () => handlePress("2"))}
          {renderButton("3", () => handlePress("3"))}
          {renderButton("-", () => handlePress("-"), "operator")}
        </View>

        <View style={styles.row}>
          {renderButton("0", () => handlePress("0"))}
          {renderButton(".", () => handlePress("."))}
          {renderButton("=", handleEqual, "action")}
          {renderButton("+", () => handlePress("+"), "operator")}
        </View>

        <View style={styles.row}>
          {renderButton("C", handleClear, "action")}
          {renderButton("DEL", handleDelete, "action")}
        </View>
      </View>
    </View>
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
  title: {
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
  displayContainer: {
    backgroundColor: "#1F222A",
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
    minHeight: 110,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  displayText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "300",
  },
  keypad: {
    backgroundColor: "#181B22",
    borderRadius: 24,
    padding: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#3B3E46",
    marginHorizontal: 4,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  operatorButton: {
    backgroundColor: "#5F7885",
  },
  scientificButton: {
    backgroundColor: "#2A2D35",
    borderWidth: 1,
    borderColor: "#4F67FF",
  },
  actionButton: {
    backgroundColor: "#4F67FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});