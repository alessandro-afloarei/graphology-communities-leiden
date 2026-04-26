# @aflsolutions/graphology-communities-leiden

Leiden community detection for [`graphology`](https://graphology.github.io), with a hard cap on outer iterations for use on very large graphs.

> **Origin:** This is an extracted, repackaged copy of [`graphology-communities-leiden`](https://github.com/graphology/graphology/tree/master/src/communities-leiden) from the upstream `graphology` monorepo. All credit for the algorithm and its JavaScript implementation goes to Guillaume Plique and the graphology contributors. License is unchanged (MIT).

## Why this fork

The upstream package runs the outer Leiden loop until convergence. On large code-graph workloads (>100k nodes, >500k edges), this can take minutes per pass and exhibit pathological tail iterations that contribute <2% modularity for >50% of total runtime.

This fork adds an optional **`maxIterations`** cap so callers can bound runtime on adversarial inputs. The first 2–3 outer iterations capture the bulk of final modularity; after that, returns diminish quickly. Setting `maxIterations: 3` on large graphs typically trades <2% community-quality loss for 5–10× faster runtime.

The default behavior is unchanged (`maxIterations: 0` = unlimited, run until convergence).

## Changes vs upstream

| File | Change |
|---|---|
| `package.json` | Renamed to `@aflsolutions/graphology-communities-leiden`; bumped to `1.1.0`; trimmed `files` to ship only what's needed; kept upstream `repository` field pointing at the original location |
| `index.d.ts` | Added `maxIterations?: number` to `LeidenOptions` with JSDoc explaining the trade-off |
| `index.js` | Added `maxIterations: 0` to the `DEFAULTS` object; added a single `if (options.maxIterations > 0 && iteration >= options.maxIterations) break;` guard at the top of the outer `while` loop in `undirectedLeiden` |

No algorithmic changes. No changes to `utils.js`, `utils.d.ts`, or `LICENSE.txt`. The `directedLeiden` path is untouched (it remains commented out in upstream as well).

## Installation

```sh
npm install @aflsolutions/graphology-communities-leiden
```

## Usage

```js
import leiden from '@aflsolutions/graphology-communities-leiden';

// Default: run until convergence (matches upstream)
const communities = leiden(graph);

// Bounded: stop after at most 3 outer iterations
const communities = leiden(graph, { maxIterations: 3 });

// Assign communities as a node attribute
leiden.assign(graph, { maxIterations: 3 });

// Detailed output
const details = leiden.detailed(graph, { maxIterations: 3 });
```

### Options

All upstream options are supported:

- **`attributes.weight`** *(string, default `"weight"`)* — name of the edge weight attribute
- **`attributes.community`** *(string, default `"community"`)* — name of the community attribute used by `assign`
- **`randomWalk`** *(boolean, default `true`)* — traverse the graph randomly
- **`resolution`** *(number, default `1`)* — higher values produce more communities
- **`rng`** *(function, default `Math.random`)* — RNG, useful for seeding via [`seedrandom`](https://www.npmjs.com/package/seedrandom)
- **`weighted`** *(boolean, default `false`)* — take edge weights into account

Plus the new option:

- **`maxIterations`** *(number, default `0`)* — hard cap on outer iterations. `0` = unlimited (upstream default). Setting `N > 0` stops after exactly `N` iterations even if the algorithm has not converged.

### Detailed output

`leiden.detailed(graph, options)` returns:

- `communities` — `{ [node: string]: number }` partition
- `count` — number of communities
- `deltaComputations` — number of delta computations run
- `dendrogram` — array of partitions across the hierarchy
- `modularity` — final modularity
- `moves` — array of move counts per iteration
- `nodesVisited` — total nodes visited across iterations
- `resolution` — resolution parameter used

## Algorithm

Implements the Leiden algorithm from:

> Traag, V. A., Waltman, L., & van Eck, N. J. (2019). *From Louvain to Leiden: Guaranteeing Well-Connected Communities.* Scientific Reports, 9(1), 5233. doi:10.1038/s41598-019-41695-z. <https://arxiv.org/abs/1810.08473>

References list and theoretical background match upstream — see the doc-comment at the top of `index.js`.

## License

MIT, same as upstream. See `LICENSE.txt`.
