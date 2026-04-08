import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveHistory = async (item) => {
  try {
    const existingHistory = await AsyncStorage.getItem("history");
    const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
    historyArray.push(item);
    await AsyncStorage.setItem("history", JSON.stringify(historyArray));
  } catch (error) {
    console.log("Error saving history:", error);
  }
};

export const getHistory = async () => {
  try {
    const existingHistory = await AsyncStorage.getItem("history");
    return existingHistory ? JSON.parse(existingHistory) : [];
  } catch (error) {
    console.log("Error getting history:", error);
    return [];
  }
};

export const clearAllHistory = async () => {
  try {
    await AsyncStorage.removeItem("history");
  } catch (error) {
    console.log("Error clearing history:", error);
  }
};