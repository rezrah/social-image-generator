export const typography = {
  scale: {
    headline: {
      ["7xl"]: {
        fontSize: 224,
        lineHeight: 240,
      },
      ["6xl"]: {
        fontSize: 160,
        lineHeight: 170,
      },
      ["5xl"]: {
        fontSize: 112,
        lineHeight: 120,
      },
      ["4xl"]: {
        fontSize: 96,
        lineHeight: 104,
      },
      ["3xl"]: {
        fontSize: 88,
        lineHeight: 96,
      },
      ["2xl"]: {
        fontSize: 80,
        lineHeight: 88,
      },
      ["xl"]: {
        fontSize: 72,
        lineHeight: 80,
      },
      ["l"]: {
        fontSize: 64,
        lineHeight: 72,
      },
      ["m"]: {
        fontSize: 56,
        lineHeight: 64,
      },
      ["s"]: {
        fontSize: 48,
        lineHeight: 56,
      },
      ["xs"]: {
        fontSize: 40,
        lineHeight: 40,
      },
      ["2xs"]: {
        fontSize: 32,
        lineHeight: 36,
      },
      ["3xs"]: {
        fontSize: 28,
        lineHeight: 32,
      },
      ["4xs"]: {
        fontSize: 24,
        lineHeight: 28,
      },
      ["5xs"]: {
        fontSize: 20,
        lineHeight: 24,
      },
      ["6xs"]: {
        fontSize: 16,
        lineHeight: 20,
      },
    },
    body: {
      ["3xl"]: {
        fontSize: 56,
        lineHeight: 64,
      },
      ["2xl"]: {
        fontSize: 48,
        lineHeight: 56,
      },
      ["xl"]: {
        fontSize: 40,
        lineHeight: 44,
      },
      ["l"]: {
        fontSize: 32,
        lineHeight: 36,
      },
      ["m"]: {
        fontSize: 24,
        lineHeight: 32,
      },
      ["s"]: {
        fontSize: 20,
        lineHeight: 28,
      },
      ["xs"]: {
        fontSize: 16,
        lineHeight: 24,
      },
      ["2xs"]: {
        fontSize: 14,
        lineHeight: 20,
      },
      ["3xs"]: {
        fontSize: 12,
        lineHeight: 18,
      },
    },
    cta: {
      ["l"]: {
        fontSize: 20,
        lineHeight: 20,
      },
      ["m"]: {
        fontSize: 16,
        lineHeight: 16,
      },
      ["s"]: {
        fontSize: 12,
        lineHeight: 12,
      },
    },
  },
  headline: {
    primary: {
      fontFamily: "AllianceNo1ExtraBold",
    },
    secondary: {
      fontFamily: "AllianceNo1SemiBold",
    },
    tertiary: {
      fontFamily: "AllianceNo1Medium",
    },
  },
  body: {
    fontFamily: "AllianceNo1Regular",
  },
  cta: {
    fontFamily: "AllianceNo1SemiBold",
  },
};

export const typePairings = {
  m: {
    heading: `${typography.scale.headline["m"].fontSize}px ${typography.headline.primary.fontFamily}`,
    headingLineheight: `${typography.scale.headline["m"].lineHeight}px`,
    subheading: `${typography.scale.headline["xs"].fontSize}px ${typography.headline.secondary.fontFamily}`,
    subheadingLineheight: `${typography.scale.headline["xs"].lineHeight}px`,
  },
  l: {
    heading: `${typography.scale.headline["2xl"].fontSize}px ${typography.headline.primary.fontFamily}`,
    headingLineheight: `${typography.scale.headline["2xl"].lineHeight}px`,
    subheading: `${typography.scale.headline["xs"].fontSize}px ${typography.headline.secondary.fontFamily}`,
    subheadingLineheight: `${typography.scale.headline["xs"].lineHeight}px`,
  },
  xl: {
    heading: `${typography.scale.headline["4xl"].fontSize}px ${typography.headline.primary.fontFamily}`,
    headingLineheight: `${typography.scale.headline["4xl"].lineHeight}px`,
    subheading: `${typography.scale.headline["xs"].fontSize}px ${typography.headline.secondary.fontFamily}`,
    subheadingLineheight: `${typography.scale.headline["xs"].lineHeight}px`,
  },
};

export const fgDefault = (theme) => (theme === "light" ? "#24292F" : "#ffffff");
export const fgMuted = (theme) => (theme === "light" ? "#57606A" : "#8B949E");
