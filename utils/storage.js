import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveHistory = async (item) => {
  try {
    const existing = await AsyncStorage.getItem("history");
    const history = existing ? JSON.parse(existing) : [];
    history.push(item);
    await AsyncStorage.setItem("history", JSON.stringify(history));
  } catch (error) {
    console.log("Error saving history:", error);
  }
};


export const getHistory = async () => {
  try {
    const existing = await AsyncStorage.getItem("history");
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.log("Error loading history:", error);
    return [];
  }
};


export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem("history");
  } catch (error) {
    console.log("Error clearing history:", error);
  }
};