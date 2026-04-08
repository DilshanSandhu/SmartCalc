import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import Svg, { Line, Text as SvgText } from "react-native-svg";
import { saveHistory } from "../utils/storage";

export default function GraphScreen() {
  const [equation, setEquation] = useState("");
  const [linePoints, setLinePoints] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const generateGraph = async () => {
    if (equation.trim() === "") {
      Alert.alert("Error", "Please enter an equation like 2*x + 3");
      return;
    }

    try {
      const xStart = -3;
      const xEnd = 3;

      const yStart = eval(equation.replace(/x/g, `(${xStart})`));
      const yEnd = eval(equation.replace(/x/g, `(${xEnd})`));

      if (
        typeof yStart !== "number" ||
        typeof yEnd !== "number" ||
        isNaN(yStart) ||
        isNaN(yEnd)
      ) {
        Alert.alert("Error", "Invalid equation");
        return;
      }

      const width = 330;
      const height = 360;
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = 45;

      const svgX1 = centerX + xStart * scale;
      const svgY1 = centerY - yStart * scale;
      const svgX2 = centerX + xEnd * scale;
      const svgY2 = centerY - yEnd * scale;

      setLinePoints({
        x1: svgX1,
        y1: svgY1,
        x2: svgX2,
        y2: svgY2,
      });

      await saveHistory("Graph: y = " + equation);
    } catch {
      Alert.alert("Error", "Invalid equation");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>SmartCalc</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <Text style={styles.screenTitle}>Graph</Text>

      <View style={styles.inputCard}>
        <TextInput
          value={equation}
          onChangeText={setEquation}
          placeholder="2*x + 3"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => {
            setEquation("");
            setLinePoints(null);
          }}
          style={styles.clearInputButton}
        >
          <Text style={styles.clearInputText}>X</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={generateGraph} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate</Text>
      </TouchableOpacity>

      <View style={styles.graphCard}>
        <Svg width="350" height="380">
          <Line x1="20" y1="190" x2="330" y2="190" stroke="white" strokeWidth="1" />
          <Line x1="175" y1="20" x2="175" y2="360" stroke="white" strokeWidth="1" />

          <SvgText x="35" y="185" fill="white" fontSize="14">-3</SvgText>
          <SvgText x="80" y="185" fill="white" fontSize="14">-2</SvgText>
          <SvgText x="125" y="185" fill="white" fontSize="14">-1</SvgText>
          <SvgText x="172" y="185" fill="white" fontSize="14">0</SvgText>
          <SvgText x="215" y="185" fill="white" fontSize="14">1</SvgText>
          <SvgText x="260" y="185" fill="white" fontSize="14">2</SvgText>
          <SvgText x="305" y="185" fill="white" fontSize="14">3</SvgText>

          <SvgText x="182" y="40" fill="white" fontSize="14">3</SvgText>
          <SvgText x="182" y="90" fill="white" fontSize="14">2</SvgText>
          <SvgText x="182" y="140" fill="white" fontSize="14">1</SvgText>
          <SvgText x="182" y="240" fill="white" fontSize="14">-1</SvgText>
          <SvgText x="182" y="290" fill="white" fontSize="14">-2</SvgText>
          <SvgText x="182" y="340" fill="white" fontSize="14">-3</SvgText>

          {linePoints && (
            <Line
              x1={linePoints.x1}
              y1={linePoints.y1}
              x2={linePoints.x2}
              y2={linePoints.y2}
              stroke="#4F67FF"
              strokeWidth="3"
            />
          )}
        </Svg>
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
  inputCard: {
    backgroundColor: "#1F222A",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
  },
  clearInputButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3B3E46",
    justifyContent: "center",
    alignItems: "center",
  },
  clearInputText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  generateButton: {
    backgroundColor: "#4F67FF",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  graphCard: {
    flex: 1,
    backgroundColor: "#1F222A",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});