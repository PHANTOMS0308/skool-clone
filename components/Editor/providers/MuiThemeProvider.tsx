import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#202124",
    },
    secondary: {
      main: "#909090",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#e4e4e4",
            },
            "&:hover fieldset": {
              borderColor: "#e4e4e4",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#202124",
            },
            "&.Mui-disabled": {
              backgroundColor: "#e4e4e4",
              "& fieldset": {
                border: "none",
              },
            },
          },
        },
      },
      defaultProps: {
        inputProps: {
          style: {
            padding: "16.5px 12px",
            height: "19px",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#202124",
          fontSize: "14px",
          padding: "10px",
          marginBottom: "4px !important",
        },
      },
    },
  },
});

export type MuiThemeProviderProps = {
  children: React.ReactNode;
};

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
