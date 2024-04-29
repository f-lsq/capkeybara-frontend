import { createGlobalStyle } from "styled-components";

export const StyledGlobal = createGlobalStyle`
  * {
    margin: 0;
    padding: 0 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

`