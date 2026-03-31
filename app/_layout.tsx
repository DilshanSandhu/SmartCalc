import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "SmartCalc" }} />
      <Stack.Screen name="scientific" options={{ title: "Scientific" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="convert" options={{ title: "Convert" }} />
      <Stack.Screen name="graph" options={{ title: "Graph" }} />
    </Stack>
  );
}