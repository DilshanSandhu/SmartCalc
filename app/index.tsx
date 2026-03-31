import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function HomeScreen() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.container}>
      
      
      <TouchableOpacity
        onPress={() => setShowMenu(!showMenu)}
        style={{ position: "absolute", top: 50, left: 20, zIndex: 10 }}
      >
        <Text style={{ fontSize: 22 }}>☰</Text>
      </TouchableOpacity>

      {showMenu && (
        <View
          style={{
            position: "absolute",
            top: 90,
            left: 20,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 8,
            elevation: 5,
            zIndex: 10,
          }}
        >
          <Text onPress={() => { setShowMenu(false); router.push("/"); }}>
            Basic
          </Text>

          <Text onPress={() => { setShowMenu(false); router.push("/scientific"); }}>
            Scientific
          </Text>

          <Text onPress={() => { setShowMenu(false); router.push("/convert"); }}>
            Convert
          </Text>

          <Text onPress={() => { setShowMenu(false); router.push("/graph"); }}>
            Graph
          </Text>

          <Text onPress={() => { setShowMenu(false); router.push("/history"); }}>
            History
          </Text>
        </View>
      )}

      {/* YOUR ORIGINAL UI */}
      <Text style={styles.title}>SmartCalc</Text>
      <Text style={styles.subtitle}>Basic Calculator Screen</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});