export const colors: string[] = [
  '#b6174b',
  '#dc136c',
  '#247ba0',
  '#111d4a',
  '#92140c',
  '#bfab25',
  '#b81365',
  '#026c7c',
  '#642ca9',
  '#ff36ab',
  '#ffdde1',
  '#f6f2ff',
  '#48bf84',
  '#439775',
  '#fbaf00',
  '#df2935',
  '#dfa06e',
  '#99e1d9',
  '#423e3b',
  '#ff2e00',
  '#4c1e4f',
  '#a51c30',
  '#a14ebf',
  '#af2bbf',
  '#5bc8af',
  '#f0f600',
  '#00e5e8',
];

const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)

const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"))

const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16)

const getAlphafloat = (a, alpha) => {
    if (typeof a !== "undefined") {return a / 255}
    if ((typeof alpha != "number") || alpha <0 || alpha >1){
      return 1
    }
    return alpha
}

export const hexToRGBA = (hex: string, alpha: number) => {
    if (!isValidHex(hex)) {
      // throw new Error(`Invalid HEX, ${hex}`)
      console.warn(`Invalid Hex, ${hex}`)
      return hex;
    
    }
    const chunkSize = Math.floor((hex.length - 1) / 3)
    const hexArr = getChunksFromString(hex.slice(1), chunkSize)
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
    return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`
}