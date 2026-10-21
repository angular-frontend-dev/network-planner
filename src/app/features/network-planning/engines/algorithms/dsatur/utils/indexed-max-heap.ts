export class IndexedMaxHeap<T> {
  private readonly items: T[] = [];
  private readonly positions: number[] = [];

  constructor(
    private readonly getKey: (value: T) => number,
    private readonly compare: (a: T, b: T) => number,
  ) {}

  get size(): number {
    return this.items.length;
  }

  has(key: number): boolean {
    return this.positions[key] !== undefined;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get(key: number): T | undefined {
    const index = this.positions[key];

    if (index === undefined) {
      return undefined;
    }

    return this.items[index];
  }

  push(value: T): void {
    const key = this.getKey(value);

    if (this.positions[key] !== undefined) {
      throw new Error("Heap already contains this key.");
    }

    const index = this.items.length;

    this.items.push(value);
    this.positions[key] = index;

    this.bubbleUp(index);
  }

  pop(): T | undefined {
    const max = this.peek();

    if (max === undefined) {
      return undefined;
    }

    this.delete(this.getKey(max));

    return max;
  }

  delete(key: number): boolean {
    const index = this.positions[key];

    if (index === undefined) {
      return false;
    }

    const lastIndex = this.items.length - 1;

    delete this.positions[key];

    if (index === lastIndex) {
      this.items.pop();
      return true;
    }

    const last = this.items.pop()!;

    this.items[index] = last;
    this.positions[this.getKey(last)] = index;

    const newIndex = this.bubbleUp(index);
    this.bubbleDown(newIndex);

    return true;
  }

  update(key: number): void {
    const index = this.positions[key];

    if (index === undefined) {
      return;
    }

    const newIndex = this.bubbleUp(index);

    this.bubbleDown(newIndex);
  }

  private bubbleUp(index: number): number {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.compare(this.items[index], this.items[parentIndex]) <= 0) {
        break;
      }

      this.swap(index, parentIndex);

      index = parentIndex;
    }

    return index;
  }

  private bubbleDown(index: number): number {
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;

      let largestIndex = index;

      if (
        leftIndex < this.items.length &&
        this.compare(this.items[leftIndex], this.items[largestIndex]) > 0
      ) {
        largestIndex = leftIndex;
      }

      if (
        rightIndex < this.items.length &&
        this.compare(this.items[rightIndex], this.items[largestIndex]) > 0
      ) {
        largestIndex = rightIndex;
      }

      if (largestIndex === index) {
        break;
      }

      this.swap(index, largestIndex);

      index = largestIndex;
    }

    return index;
  }

  private swap(a: number, b: number): void {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];

    this.positions[this.getKey(this.items[a])] = a;

    this.positions[this.getKey(this.items[b])] = b;
  }
}
