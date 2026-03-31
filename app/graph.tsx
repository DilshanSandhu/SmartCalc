import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line, Text as SvgText } from "react-native-svg";

export default function GraphScreen() {
  const [equation, setEquation] = useState("");
  const [linePoints, setLinePoints] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const generateGraph = () => {
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
    } catch {
      Alert.alert("Error", "Invalid equation");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111", padding: 20 }}>
      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Graph
      </Text>

      <View
        style={{
          backgroundColor: "#2a2a2a",
          borderRadius: 10,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TextInput
          value={equation}
          onChangeText={setEquation}
          placeholder="2*x + 3"
          placeholderTextColor="#aaa"
          style={{ color: "white", flex: 1, fontSize: 18 }}
        />

        <TouchableOpacity
          onPress={() => {
            setEquation("");
            setLinePoints(null);
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#444",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            X
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={generateGraph}
        style={{
          backgroundColor: "#4c8cff",
          padding: 15,
          borderRadius: 14,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Generate
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Svg width="350" height="380">
          <Line
            x1="20"
            y1="190"
            x2="330"
            y2="190"
            stroke="white"
            strokeWidth="1"
          />
          <Line
            x1="175"
            y1="20"
            x2="175"
            y2="360"
            stroke="white"
            strokeWidth="1"
          />

          <SvgText x="35" y="185" fill="white" fontSize="14">
            -3
          </SvgText>
          <SvgText x="80" y="185" fill="white" fontSize="14">
            -2
          </SvgText>
          <SvgText x="125" y="185" fill="white" fontSize="14">
            -1
          </SvgText>
          <SvgText x="172" y="185" fill="white" fontSize="14">
            0
          </SvgText>
          <SvgText x="215" y="185" fill="white" fontSize="14">
            1
          </SvgText>
          <SvgText x="260" y="185" fill="white" fontSize="14">
            2
          </SvgText>
          <SvgText x="305" y="185" fill="white" fontSize="14">
            3
          </SvgText>

          <SvgText x="182" y="40" fill="white" fontSize="14">
            3
          </SvgText>
          <SvgText x="182" y="90" fill="white" fontSize="14">
            2
          </SvgText>
          <SvgText x="182" y="140" fill="white" fontSize="14">
            1
          </SvgText>
          <SvgText x="182" y="240" fill="white" fontSize="14">
            -1
          </SvgText>
          <SvgText x="182" y="290" fill="white" fontSize="14">
            -2
          </SvgText>
          <SvgText x="182" y="340" fill="white" fontSize="14">
            -3
          </SvgText>

          {linePoints && (
            <Line
              x1={linePoints.x1}
              y1={linePoints.y1}
              x2={linePoints.x2}
              y2={linePoints.y2}
              stroke="#4c8cff"
              strokeWidth="3"
            />
          )}
        </Svg>
      </View>
    </View>
  );
}