import { StyleSheet } from "react-native";

export const colors = {
  darkBlue: "#243757",
  lightBeige: "#DAD5B7",
  brownGray: "#665E52",
  white: "#FFFFFF",
};

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.lightBeige },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 20,
    color: colors.darkBlue,
  },
  button: {
    backgroundColor: colors.darkBlue,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  resultsContainer: { flex: 1, marginTop: 20 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkBlue,
    backgroundColor: colors.lightBeige,
    paddingVertical: 8,
    marginBottom: 10,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: colors.brownGray,
  },
});
