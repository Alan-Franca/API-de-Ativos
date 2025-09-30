import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import axios from "axios";

type Asset = {
  ticker: string;
  price: number;
  dividendYield: number;
  type: "Ação" | "FII";
  logo: string;
};

const BRAPI_API_TOKEN = process.env.EXPO_PUBLIC_BRAPI_API_TOKEN;
const BRAPI_BASE_URL = "https://brapi.dev/api";

const fetchAssetsList = async (): Promise<
  { ticker: string; price: number }[]
> => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/quote/list`, {
      params: { token: BRAPI_API_TOKEN },
    });
    return response.data.stocks.map((asset: any) => ({
      ticker: asset.stock,
      price: asset.close,
    }));
  } catch (error) {
    console.error("Erro ao buscar a lista de ativos:", error);
    throw new Error("Falha ao buscar a lista de ativos.");
  }
};

const fetchAssetDetails = async (ticker: string): Promise<Asset | null> => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/quote/${ticker}`, {
      params: { token: BRAPI_API_TOKEN },
    });
    const result = response.data.results[0];

    if (!result || result.regularMarketPrice === undefined || !result.symbol) {
      console.warn(
        `Dados críticos (preço/símbolo) em falta para o ticker ${ticker}. Ativo ignorado.`
      );
      return null;
    }

    return {
      ticker: result.symbol,
      price: result.regularMarketPrice,
      dividendYield: result.dividendYield || 0,
      logo: result.logourl,
      type: result.symbol.endsWith("11") ? "FII" : "Ação",
    };
  } catch (error) {
    console.error(`Erro ao buscar detalhes para ${ticker}:`, error);
    return null;
  }
};

export default function CalculadoraScreen() {
  const [investValue, setInvestValue] = useState<string>("");
  const [finalAssets, setFinalAssets] = useState<Asset[]>([]);
  const [wasCalculated, setWasCalculated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFilterAssets = async () => {
    const maxPrice = parseFloat(investValue);
    if (isNaN(maxPrice) || maxPrice <= 0) {
      Alert.alert("Valor Inválido", "Por favor, insere um número positivo.");
      return;
    }

    setIsLoading(true);
    setFinalAssets([]);
    setWasCalculated(false);

    try {
      const basicList = await fetchAssetsList();
      const priceFilteredList = basicList.filter(
        (asset) => asset.price <= maxPrice
      );
      priceFilteredList.sort((a, b) => a.price - b.price);

      const candidates = priceFilteredList.slice(0, 150);

      const detailedAssetPromises = candidates.map((asset) =>
        fetchAssetDetails(asset.ticker)
      );
      const detailedAssets = (await Promise.all(detailedAssetPromises)).filter(
        (asset): asset is Asset => asset !== null
      );

      detailedAssets.sort((a, b) => b.dividendYield - a.dividendYield);
      setFinalAssets(detailedAssets.slice(0, 100));
    } catch (error) {
      if (error instanceof Error) Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
      setWasCalculated(true);
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={colors.darkBlue}
          style={{ marginTop: 20 }}
        />
      );
    }
    if (!wasCalculated) return null;
    if (finalAssets.length === 0) {
      return (
        <Text style={styles.noResultsText}>
          Nenhum ativo encontrado com estes critérios.
        </Text>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          Melhores Ativos até R$ {investValue}
        </Text>
        <FlatList
          style={{ flex: 1 }}
          data={finalAssets}
          keyExtractor={(item) => item.ticker}
          renderItem={({ item }) => (
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
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filtro de Ativos</Text>
      <TextInput
        style={styles.input}
        placeholder="Preço máximo por cota (ex: 300)"
        placeholderTextColor={colors.darkBeige}
        keyboardType="numeric"
        value={investValue}
        onChangeText={setInvestValue}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleFilterAssets}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Analisando..." : "Analisar Ativos"}
        </Text>
      </TouchableOpacity>
      {renderResults()}
    </View>
  );
}

const colors = {
  darkBlue: "#243757",
  tealBlue: "#3A5F6F",
  lightBeige: "#DAD5B7",
  darkBeige: "#C2B79B",
  brownGray: "#665E52",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.lightBeige },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 20,
    color: colors.darkBlue,
  },
  input: {
    height: 50,
    borderColor: colors.darkBeige,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: colors.white,
    color: colors.brownGray,
  },
  button: {
    backgroundColor: colors.darkBlue,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  resultsContainer: { flex: 1, marginTop: 20 },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.darkBlue,
  },
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
  dyText: {
    color: colors.brownGray,
    marginTop: 8,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: colors.brownGray,
  },
});
