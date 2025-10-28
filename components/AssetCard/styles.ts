import { StyleSheet, Platform } from "react-native";

export const colors = {
  tealBlue: "#3A5F6F",
  darkBeige: "#C2B79B",
  brownGray: "#665E52",
  white: "#FFFFFF",
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: colors.darkBeige,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: { elevation: 4 },
      web: { boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
    }),
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  ticker: { fontSize: 18, fontWeight: "bold", color: colors.tealBlue },
  totalItem: {
    fontWeight: "bold",
    color: colors.tealBlue,
    fontSize: 14,
    marginTop: 2,
  },
});
