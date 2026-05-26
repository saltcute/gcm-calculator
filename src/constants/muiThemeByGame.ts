import { createTheme } from "@mui/material/styles";

const muiThemeBase = createTheme({
    typography: {
        fontFamily: "inherit",
    },
});
export const muiThemeByGame = {
    maimaidx: createTheme(muiThemeBase, {
        palette: {
            primary: {
                main: "#ff36ab",
            },
        },
    }),
    chunithm: createTheme(muiThemeBase, {
        palette: {
            primary: {
                main: "#7b47ff",
            },
        },
    }),
    ongeki: createTheme(muiThemeBase, {
        palette: {
            primary: {
                main: "#68b854",
            },
        },
    }),
    maimai: createTheme(muiThemeBase, {
        palette: {
            primary: {
                main: "#eb1e9a",
            },
        },
    }),
};
