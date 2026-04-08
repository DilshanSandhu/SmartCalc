import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  const handleEqual = () => {
    try {
      const expression = display.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(expression);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const handleScientific = (func: string) => {
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
      <Text style={styles.title}>Scientific Calculator</Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  displayContainer: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 90,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  displayText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#334155",
    marginHorizontal: 4,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  operatorButton: {
    backgroundColor: "#f59e0b",
  },
  scientificButton: {
    backgroundColor: "#2563eb",
  },
  actionButton: {
    backgroundColor: "#dc2626",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});