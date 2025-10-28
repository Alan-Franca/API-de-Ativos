import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./styles";

export type Asset = {
  ticker: string;
  price: number;
  dividendYield: number;
  type: "Ação" | "FII";
  logo: string;
};

type AssetCardProps = {
  item: Asset;
};

export function AssetCard({ item }: AssetCardProps) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.ticker}>
            {item.ticker} ({item.type})
          </Text>
          <Text style={styles.totalItem}>
            Valor da Cota: R$ {item.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
