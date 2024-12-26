import resetCSS from "./reset.css?raw";
import stylesCSS from "./styles.css?raw";

const compressCSS = (css: string) => {
  return css
    .replace(/\s+/g, " ")
    .replace(/\/\*.*?\*\//g, "")
    .replace(/\s*([{};:,>])\s*/g, "$1")
    .replace(/;\s*}/g, "}")
    .trim();
};

const styles = compressCSS(`
  ${resetCSS}
  ${stylesCSS}
`);

export default styles;
