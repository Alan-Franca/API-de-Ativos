import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { styles, colors } from "./styles";
import { AssetCard, Asset } from "../components/AssetCard/AssetCard";
import { PriceSlider } from "../components/PriceSlider/PriceSlider";

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
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 30]);
  const [finalAssets, setFinalAssets] = useState<Asset[]>([]);
  const [wasCalculated, setWasCalculated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFilterAssets = async () => {
    const [minPrice, maxPrice] = priceRange;
    if (minPrice > maxPrice) {
      Alert.alert(
        "Intervalo Inválido",
        "O preço mínimo não pode ser maior que o preço máximo."
      );
      return;
    }

    setIsLoading(true);
    setFinalAssets([]);
    setWasCalculated(false);

    try {
      const basicList = await fetchAssetsList();
      const priceFilteredList = basicList.filter(
        (asset) => asset.price >= minPrice && asset.price <= maxPrice
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
      setFinalAssets(detailedAssets.slice(0, 30));
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
          Top 30 Ativos entre R$ {priceRange[0].toFixed(2)} e R${" "}
          {priceRange[1].toFixed(2)}
        </Text>
        <FlatList
          data={finalAssets}
          keyExtractor={(item) => item.ticker}
          renderItem={({ item }) => <AssetCard item={item} />}
          style={{ flex: 1 }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filtro de Ativos</Text>

      <PriceSlider
        label="Preço Mínimo"
        value={priceRange[0]}
        onValueChange={(value) => setPriceRange([value, priceRange[1]])}
        maximumValue={200}
      />

      <PriceSlider
        label="Preço Máximo"
        value={priceRange[1]}
        onValueChange={(value) => setPriceRange([priceRange[0], value])}
        maximumValue={500}
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
