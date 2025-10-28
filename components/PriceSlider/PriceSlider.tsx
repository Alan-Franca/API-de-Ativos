import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles, colors } from "./styles";

type PriceSliderProps = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  maximumValue: number;
};

export function PriceSlider({
  label,
  value,
  onValueChange,
  maximumValue,
}: PriceSliderProps) {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>
        {label}: R$ {value.toFixed(2)}
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={maximumValue}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.darkBlue}
        maximumTrackTintColor={colors.darkBeige}
        thumbTintColor={colors.tealBlue}
      />
    </View>
  );
}
