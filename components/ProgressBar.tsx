import { humanReadableAmount } from "@/lib/utility";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProgressBar = ({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) => {
  const totalIncome = income || 1; // Avoid division by zero
  const expenseRatio = Math.min(expense / totalIncome, 1); // Ensure ratio does not exceed 1

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {/* Green bar representing total income */}
        <View
          style={[styles.incomeBar, { width: "100%" }]}
          className="bg-gray-300"
        />

        {/* Red overlay representing total expense */}
        <View
          style={[styles.expenseBar, { width: `${expenseRatio * 100}%` }]}
          className="bg-green-300"
        />
      </View>
      <Text className="text-white font-semibold mt-1 ml-1">{`${humanReadableAmount(
        expense
      )} of ${humanReadableAmount(income)} spent.`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 25,
    backgroundColor: "#e0e0e0",
    borderRadius: 12.5,
    overflow: "hidden",
    position: "relative",
  },
  incomeBar: {
    height: "100%",
  },
  expenseBar: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  infoContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  incomeText: {
    color: "green",
    fontWeight: "bold",
  },
  expenseText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default ProgressBar;
