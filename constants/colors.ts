const palette = {
  textPrimary: "#1C1C1A",
  textSecondary: "#554C37",
  background: "#F5F5F5",
  card: "#FFFFFF",
  border: "#E8E4DA",
  divider: "#EFEAE0",

  category: {
    Creative: "#E9AECE",
    Business: "#9DD3C4",
    Personal: "#9CC9DD",
    Reading: "#AECC57",
    Sports: "#D58F77",
    Cooking: "#F1C27D",
  } as const,

  type: {
    Idea: "#9CC9DD",
    Hobby: "#D7E8B5",
  } as const,

  energy: {
    Low: "#85CB7D",
    Medium: "#E9F876",
    High: "#E7645F",
  } as const,

  warning: "#EBF527",
  success: "#85CB7D",
};

const colors = {
  light: {
    text: palette.textPrimary,
    tint: palette.textPrimary,

    background: palette.background,
    foreground: palette.textPrimary,

    card: palette.card,
    cardForeground: palette.textPrimary,

    primary: palette.textPrimary,
    primaryForeground: "#FFFFFF",

    secondary: "#EAE6DB",
    secondaryForeground: palette.textPrimary,

    muted: "#EFEAE0",
    mutedForeground: palette.textSecondary,

    accent: "#EAE6DB",
    accentForeground: palette.textPrimary,

    destructive: "#C0524A",
    destructiveForeground: "#FFFFFF",

    border: palette.border,
    input: palette.border,

    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    divider: palette.divider,
    warning: palette.warning,

    category: palette.category,
    type: palette.type,
    energy: palette.energy,
  },

  radius: 14,
};

export default colors;
