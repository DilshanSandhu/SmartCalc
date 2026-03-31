import { View, Text, StyleSheet } from "react-native";

export default function GraphScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Graph</Text>
      <Text style={styles.subtitle}>Add graph logic here</Text>
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
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
});