import { Platform } from "react-native";

export const fontFamily = {
  serif: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia, 'Times New Roman', serif",
  }) as string,
  serifBold: Platform.select({
    ios: "Georgia-Bold",
    android: "serif",
    default: "Georgia, 'Times New Roman', serif",
  }) as string,
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansSemiBold: "DMSans_600SemiBold",
  sansBold: "DMSans_700Bold",
  mono: "DMMono_400Regular",
  monoMedium: "DMMono_500Medium",
};

export const serifWeight: { fontWeight: "700" } = { fontWeight: "700" };
