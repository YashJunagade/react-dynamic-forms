import type { FormTheme } from "../types/theme";

const CSS_VAR_MAP: Record<keyof FormTheme, string> = {
  primaryColor: "--rdf-primary",
  errorColor: "--rdf-error",
  borderRadius: "--rdf-radius",
  fontFamily: "--rdf-font",
  fontSize: "--rdf-font-size",
  inputBorderColor: "--rdf-border",
  inputFocusBorderColor: "--rdf-border-focus",
  labelColor: "--rdf-label-color",
  descriptionColor: "--rdf-desc-color",
  backgroundColor: "--rdf-bg",
  spacing: "--rdf-spacing",
};

export function applyTheme(theme: FormTheme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    const val = theme[key as keyof FormTheme];
    if (val) vars[cssVar] = val;
  }
  return vars;
}
