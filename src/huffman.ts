import { OrderedQueue } from "./queue";

export interface TreeNode {
  symbol?: string;
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
  // generate reversed codes
  let reversedCodes: Map<string, string> = new Map();
  codes.forEach((value, key) => {
    reversedCodes.set(value, key);
  });

  // two pointers
  let result: Array<string> = [];
  let i = 0,
    j = 1;
  let tmp: string | undefined;
  for (; j <= text.length; j++) {
    tmp = reversedCodes.get(text.slice(i, j));
    // if tmp exists, return directly, let i jump to j
    if (tmp !== undefined) {
      result.push(tmp);
      i = j;
    }
  }

  return result.join("");
}

/** GET SYMBOLS CODES FROM TEXT */
export function getCodesFromText(text: string): Map<string, string> {
  const frequencyArr = getFrequency(text);

  let tree = getTree(frequencyArr);
  let codes: Map<string, string> = new Map();
  getSymbolCodes(codes, tree);

  return codes;
}

/** GET CODES FORM TREE */
function getSymbolCodes(
  codes: Map<string, string>,
  tree?: TreeNode,
  tmpCharArray: Array<string> = []
) {
  if (!tree || (tree.leafs.length === 0 && !tree.symbol)) return;

  if (tree.leafs.length === 0) {
    codes.set(tree.symbol!, tmpCharArray.join(""));
    return;
  }

  getSymbolCodes(codes, tree.leafs[0], tmpCharArray.concat("0"));
  getSymbolCodes(codes, tree.leafs[1], tmpCharArray.concat("1"));
}

/** GET SYMBOLS FREQUENCY FROM TEXT */
export function getFrequency(text: string): Array<[string, number]> {
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
export function getTree(arr: Array<[string, number]>) {
  let parent: TreeNode | undefined;
  let oq: OrderedQueue<TreeNode> = new OrderedQueue(
    (a: TreeNode, b: TreeNode) => {
      return a.weight - b.weight;
    }
  );
  oq.enqueue(
    ...arr.map((elem) => {
      return {
        symbol: elem[0],
        weight: elem[1],
        leafs: [],
      };
    })
  );

  let min1, min2: TreeNode;

  while (oq.length > 1) {
    min1 = oq.dequeue()!;
    min2 = oq.dequeue()!;

    parent = createNode(min1, min2)!;
    oq.enqueue(parent);
  }

  parent = createNode(oq.dequeue(), oq.dequeue());
  return parent;
}

/** CREATE TREE NODE FROM TWO NODES */
function createNode(node1?: TreeNode, node2?: TreeNode): TreeNode | undefined {
  if (node1 === undefined) return undefined;
  if (node2 === undefined) return node1;

  let node: TreeNode;
  let weight: number = node1.weight + node2.weight;
  let leafs: Array<TreeNode> = [node1, node2];
  node = {
    symbol: undefined,
    weight: weight,
    leafs: leafs,
  };
  return node;
}
