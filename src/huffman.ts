export interface TreeNode {
  symbols: Array<string>;
  weight: number;
  leafs: Array<TreeNode>;
}

/** ENCODE TEXT */
export function encode(text: string, codes: Map<string, string>): string {
  let result: Array<string> = [];
  for (let i = 0; i < text.length; i++) {
    result.push(codes.get(text[i])!);
  }
  return result.join("");
}

/** DECODE TEXT */
export function decode(text: string, codes: Map<string, string>): string {
  // 生成反向codes
  let reversedCodes: Map<string, string> = new Map();
  codes.forEach((value, key) => {
    reversedCodes.set(value, key);
  });

  // 双指针
  let result: Array<string> = [];
  let i = 0,
    j = 1;
  let tmp: string | undefined;
  for (; j <= text.length; j++) {
    // 如果存在此symbol, 直接返回， 跳转i指针到j
    tmp = reversedCodes.get(text.slice(i, j));

    if (tmp !== undefined) {
      result.push(tmp);
      i = j;
    }
  }

  return result.join("");
}

/** GET SYMBOLS CODES FROM TEXT */
export function getCodesFromText(text: string): Map<string, string> {
  const frequencyArr: Array<any> = getFrequency(text);
  const symbols = frequencyArr.map((item) => item[0]);

  let tree = getTree(frequencyArr);

  let codes: Map<string, string> = new Map(); // Array with symbols and codes
  symbols.forEach((element) => {
    codes.set(element, getSymbolCode(tree!, element)); // symbols' length > 0, so tree must exists
  });

  return codes;
}

/** GET CODE FOR SYMBOL */
function getSymbolCode(
  tree: TreeNode,
  symbol: string,
  code: string = ""
  // @ts-ignore
): string {
  let arr = [];
  if (tree.leafs.length === 0) {
    return code;
  } else {
    arr = tree.leafs;
  }

  if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
    return code + 0;
  if (arr[0].symbols.length === 1 && arr[0].symbols[0] !== symbol) {
    if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
      return code + 1;
    if (arr[1].symbols.includes(symbol) === true)
      return getSymbolCode(arr[1], symbol, code + 1);
  }

  if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
    return code + 1;
  if (arr[1].symbols.length === 1 && arr[1].symbols[0] !== symbol) {
    if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
      return code + 0;
    if (arr[0].symbols.includes(symbol) === true)
      return getSymbolCode(arr[0], symbol, code + 0);
  }

  if (arr[0].symbols.length >= 2 && arr[0].symbols.includes(symbol))
    return getSymbolCode(arr[0], symbol, code + 0);
  if (arr[1].symbols.length >= 2 && arr[1].symbols.includes(symbol))
    return getSymbolCode(arr[1], symbol, code + 1);
}

/** GET SYMBOLS FREQUENCY FROM TEXT */
export function getFrequency(text: string): Array<any> {
  let freq: Map<string, number> = new Map();

  for (let char of text) {
    if (freq.get(char) === undefined) freq.set(char, 1);
    else freq.set(char, freq.get(char)! + 1);
  }

  let sortArr = Array.from(freq); //descending sorting
  sortArr.sort((a, b) => b[1] - a[1]);
  return sortArr;
}

/** GENERATE HUFFMAN TREE */
export function getTree(arr: Array<any>) {
  let tree: TreeNode | undefined;

  arr = arr.map((elem) => {
    return {
      symbols: [elem[0]],
      weight: elem[1],
      leafs: [],
    };
  });

  let min1, min2: TreeNode;

  while (arr.length > 1) {
    min1 = searchMinWeightNode(arr)!;
    arr.splice(arr.indexOf(min1), 1);
    min2 = searchMinWeightNode(arr)!;
    arr.splice(arr.indexOf(min2), 1);

    tree = createNode(min1, min2);
    arr.push(tree);
  }

  tree = createNode(arr[0], arr[1]);
  return tree;
}

/** CREATE TREE NODE FROM TWO NODES */
function createNode(node1: TreeNode, node2: TreeNode): TreeNode | undefined {
  if (node1 === undefined) return undefined;
  if (node2 === undefined) return node1;

  let node: TreeNode;
  let weight: number = node1.weight + node2.weight;
  let symbols: Array<string> = node1.symbols.concat(node2.symbols);
  let leafs: Array<TreeNode> = [node1, node2];
  node = {
    symbols: symbols,
    weight: weight,
    leafs: leafs,
  };
  return node;
}

/** SEARCH NODE WITH MINIMAL WEIGHT IN TREE */
function searchMinWeightNode(arr: Array<TreeNode>, minNumber: number = -1) {
  let min = Number.POSITIVE_INFINITY;
  let result: TreeNode | undefined;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].weight <= min && arr[i].weight >= minNumber) {
      min = arr[i].weight;
      result = arr[i];
    }
  }
  return result;
}
