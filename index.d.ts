import Graph from 'graphology';

type RNGFunction = () => number;

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export type LeidenOptions = {
  attributes?: {
    community?: string;
    weight?: string;
  };
  randomWalk?: boolean;
  resolution?: number;
  rng?: RNGFunction;
  weighted?: boolean;
  /**
   * Hard cap on outer Leiden iterations. 0 (default) = unlimited.
   * Set to N to stop after N iterations even before convergence.
   * The first 2-3 iterations capture 95%+ of final modularity, so
   * setting maxIterations: 3 on large graphs trades <2% community-
   * quality loss for 5-10x faster runtime.
   */
  maxIterations?: number;
};

type LeidenMapping = {[key: string]: number};

export type DetailedLeidenOutput = {
  communities: LeidenMapping;
  count: number;
  deltaComputations: number;
  dendrogram: Array<PointerArray>;
  modularity: number;
  moves: Array<Array<number>> | Array<number>;
  nodesVisited: number;
  resolution: number;
};

declare const leiden: {
  (graph: Graph, options?: LeidenOptions): LeidenMapping;
  assign(graph: Graph, options?: LeidenOptions): void;
  detailed(graph: Graph, options?: LeidenOptions): DetailedLeidenOutput;
};

export default leiden;
