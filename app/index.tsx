import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { styles, colors } from "./styles";
import { AssetCard, Asset } from "../components/AssetCard/AssetCard";
import { PriceSlider } from "../components/PriceSlider/PriceSlider";

type AssetSection = {
  title: string;
  data: Asset[];
};

const BRAPI_API_TOKEN = process.env.EXPO_PUBLIC_BRAPI_API_TOKEN;
const BRAPI_BASE_URL = "https://brapi.dev/api";

/**
 * Busca a lista completa de ativos com todos os dados necessários (incluindo logo).
 * Esta função é chamada apenas uma vez para criar o cache local.
 */
const fetchFullAssetsList = async (): Promise<Asset[]> => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/quote/list`, {
      params: { token: BRAPI_API_TOKEN, limit: 5000 },
    });
    return response.data.stocks
      .filter((asset: any) => asset.stock && asset.close && asset.logo)
      .map((asset: any) => ({
        ticker: asset.stock,
        price: asset.close,
        logo: asset.logo,
        type: asset.stock.endsWith("11") ? "FII" : "Ação",
        dividendYield: 0, // Não é mais usado, mas mantido para o tipo
      }));
  } catch (error: any) {
    console.error("Erro ao buscar a lista de ativos:", error);
    if (error.response && error.response.status === 429) {
      throw new Error(
        "A API está sobrecarregada. Por favor, reinicie o app em um minuto."
      );
    }
    throw new Error("Falha ao carregar a lista inicial de ativos.");
  }
};

export default function CalculadoraScreen() {
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 30]);
  const [assetSections, setAssetSections] = useState<AssetSection[]>([]);
  const [wasCalculated, setWasCalculated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cache para armazenar a lista completa de ativos.
  const [fullAssetList, setFullAssetList] = useState<Asset[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Busca os dados uma única vez ao iniciar o app.
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const assets = await fetchFullAssetsList();
        setFullAssetList(assets);
      } catch (e: any) {
        Alert.alert("Erro de Carregamento", e.message);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filtra e organiza os ativos a partir da lista em cache (sem novas chamadas de API).
  const handleFilterAssets = () => {
    const [minPrice, maxPrice] = priceRange;
    if (minPrice > maxPrice) {
      Alert.alert(
        "Intervalo Inválido",
        "O preço mínimo não pode ser maior que o preço máximo."
      );
      return;
    }

    setIsLoading(true);

    // Simula um pequeno atraso para o feedback visual de "Analisando..."
    setTimeout(() => {
      const priceFilteredList = fullAssetList
        .filter((asset) => asset.price >= minPrice && asset.price <= maxPrice)
        .sort((a, b) => a.price - b.price);

      if (priceFilteredList.length === 0) {
        setAssetSections([]);
      } else {
        const cheapest = priceFilteredList.slice(0, 10);
        const mostExpensive = priceFilteredList.slice(-10).reverse();
        const middleIndex = Math.floor(priceFilteredList.length / 2);
        const mediumStart = Math.max(0, middleIndex - 5);
        const medium = priceFilteredList.slice(mediumStart, mediumStart + 10);

        const sections = [
          { title: "As 10 mais baratas", data: cheapest },
          { title: "10 com valor médio", data: medium },
          { title: "As 10 mais caras", data: mostExpensive },
        ].filter((section) => section.data.length > 0);

        setAssetSections(sections);
      }

      setIsLoading(false);
      setWasCalculated(true);
    }, 500); // Meio segundo de delay para UX
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
    if (assetSections.length === 0) {
      return (
        <Text style={styles.noResultsText}>
          Nenhum ativo encontrado com estes critérios.
        </Text>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <SectionList
          sections={assetSections}
          keyExtractor={(item, index) => item.ticker + index}
          renderItem={({ item }) => <AssetCard item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
        />
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.darkBlue} />
        <Text style={{ marginTop: 10, color: colors.brownGray }}>
          Carregando dados da bolsa...
        </Text>
      </View>
    );
  }

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
