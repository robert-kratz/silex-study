import type {
  GewinnmaximierungParams,
  GewinnmaximierungSolution,
} from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveGewinnmaximierung(
  p: GewinnmaximierungParams,
): GewinnmaximierungSolution {
  const m = (p.p * p.a) / (2 * p.w);
  const xStar = m * m;
  const outputStar = p.a * Math.sqrt(xStar);
  const pi = p.p * outputStar - p.w * xStar;
  return { xStar: r2(xStar), outputStar: r2(outputStar), pi: r2(pi) };
}
