export class OrderedQueue<T> {
  compare: (a: T, b: T) => number;
  private data: Array<T> = new Array();

  constructor(compare: { (a: T, b: T): number }) {
    this.compare = compare;
  }

  private justify() {
    this.data.sort(this.compare);
  }

  enqueue(...es: T[]) {
    this.data.push(...es);
    this.justify();
  }

  dequeue(): T | undefined {
    return this.data.shift();
  }

  get length(): number {
    return this.data.length;
  }
}
