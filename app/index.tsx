import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { saveHistory } from "../utils/storage";

export default function HomeScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handlePress = (value: string) => {
    if (value === "%") {
      if (input !== "") {
        const num = parseFloat(input);
        if (!isNaN(num)) {
          setInput((num / 100).toString());
        }
      }
      return;
    }

    if (result !== "") {
      if (!isNaN(Number(value))) {
        setInput(value);
      } else {
        setInput(result + value);
      }
      setResult("");
    } else {
      setInput(input + value);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleBackspace = () => {
    if (result !== "") {
      setInput(result);
      setResult("");
    } else {
      setInput(input.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (result !== "") {
      setResult((Number(result) * -1).toString());
      return;
    }

    if (input === "") return;

    if (input.startsWith("-")) {
      setInput(input.slice(1));
    } else {
      setInput("-" + input);
    }
  };

  const handleEqual = async () => {
    try {
      const expression = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      const calculatedResult = eval(expression);

      const historyItem = input + " = " + calculatedResult;
      await saveHistory(historyItem);

      setResult(calculatedResult.toString());
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.title}>SmartCalc</Text>

        <TouchableOpacity onPress={() => router.push("/history")}>
          <Text style={styles.historyIcon}>◔</Text>
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={styles.popupMenu}>
          <Text style={styles.popupItem} onPress={() => router.push("/")}>
            Basic
          </Text>
          <Text style={styles.popupItem} onPress={() => router.push("/scientific")}>
            Scientific
          </Text>
          <Text style={styles.popupItem} onPress={() => router.push("/convert")}>
            Convert
          </Text>
          <Text style={styles.popupItem} onPress={() => router.push("/graph")}>
            Graph
          </Text>
        </View>
      )}

      <View style={styles.displayArea}>
        {result === "" ? (
          <Text style={styles.currentInputText}>
            {input === "" ? "0" : input}
          </Text>
        ) : (
          <>
            <Text style={styles.previousText}>{input}</Text>
            <Text style={styles.resultText}>{result}</Text>
          </>
        )}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <Btn text="⌫" onPress={handleBackspace} />
          <Btn text="C" onPress={handleClear} />
          <Btn text="%" onPress={() => handlePress("%")} />
          <Btn text="÷" onPress={() => handlePress("÷")} operator />
        </View>

        <View style={styles.row}>
          <Btn text="7" onPress={() => handlePress("7")} />
          <Btn text="8" onPress={() => handlePress("8")} />
          <Btn text="9" onPress={() => handlePress("9")} />
          <Btn text="×" onPress={() => handlePress("×")} operator />
        </View>

        <View style={styles.row}>
          <Btn text="4" onPress={() => handlePress("4")} />
          <Btn text="5" onPress={() => handlePress("5")} />
          <Btn text="6" onPress={() => handlePress("6")} />
          <Btn text="-" onPress={() => handlePress("-")} operator />
        </View>

        <View style={styles.row}>
          <Btn text="1" onPress={() => handlePress("1")} />
          <Btn text="2" onPress={() => handlePress("2")} />
          <Btn text="3" onPress={() => handlePress("3")} />
          <Btn text="+" onPress={() => handlePress("+")} operator />
        </View>

        <View style={styles.row}>
          <Btn text="+/-" onPress={handleToggleSign} />
          <Btn text="0" onPress={() => handlePress("0")} />
          <Btn text="." onPress={() => handlePress(".")} />
          <Btn text="=" onPress={handleEqual} equal />
        </View>
      </View>
    </View>
  );
}

function Btn({
  text,
  onPress,
  operator,
  equal,
}: {
  text: string;
  onPress: () => void;
  operator?: boolean;
  equal?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        operator && styles.operatorButton,
        equal && styles.equalButton,
      ]}
    >
      <Text style={styles.buttonText}>{text}</Text>
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
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  title: {
    color: "#7D8CFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  historyIcon: {
    color: "#8A8A8F",
    fontSize: 30,
  },
  popupMenu: {
    position: "absolute",
    top: 95,
    left: 20,
    backgroundColor: "#1F222A",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  popupItem: {
    color: "#FFFFFF",
    fontSize: 15,
    marginVertical: 6,
  },
  displayArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 24,
  },
  currentInputText: {
    color: "#FFFFFF",
    fontSize: 54,
  },
  previousText: {
    color: "#7A7D85",
    fontSize: 24,
  },
  resultText: {
    color: "#FFFFFF",
    fontSize: 64,
  },
  keypad: {
    backgroundColor: "#181B22",
    borderRadius: 28,
    padding: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    width: 74,
    height: 74,
    backgroundColor: "#3B3E46",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  operatorButton: {
    backgroundColor: "#5F7885",
  },
  equalButton: {
    backgroundColor: "#4F67FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 28,
  },
});