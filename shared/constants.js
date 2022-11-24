export const typePairings = {
  small: {
    heading: "60px AllianceNo1ExtraBold",
    headingLineheight: "68px",
    subheading: "40px AllianceNo1SemiBold",
    subheadingLineheight: "48px",
    description: "28px AllianceNo1Regular",
  },
  medium: {
    heading: "88px AllianceNo1ExtraBold",
    headingLineheight: "96px",
    subheading: "40px AllianceNo1SemiBold",
    subheadingLineheight: "48px",
    description: "28px AllianceNo1Regular",
  },
  large: {
    heading: "110px AllianceNo1ExtraBold",
    headingLineheight: "132px",
    subheading: "48px AllianceNo1SemiBold",
    subheadingLineheight: "56px",
    description: "38px AllianceNo1Regular",
  },
};

export const fgDefault = (theme) => (theme === "light" ? "#24292F" : "#ffffff");
export const fgMuted = (theme) => (theme === "light" ? "#57606A" : "#8B949E");
