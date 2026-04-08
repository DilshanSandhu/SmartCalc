import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { getHistory, clearAllHistory } from "../utils/storage";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data.reverse());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    await clearAllHistory();
    setHistory([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>History</Text>

      {history.length === 0 ? (
        <Text style={styles.emptyText}>No calculations yet</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <Text style={styles.item}>{item}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={styles.clearBtnText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111216",
    padding: 20,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 30,
    marginTop: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  itemBox: {
    backgroundColor: "#3B3E46",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  item: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  clearBtn: {
    backgroundColor: "#4F67FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  clearBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});