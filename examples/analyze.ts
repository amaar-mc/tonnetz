/**
 * Run with: npm run example
 * In an application you would import from the published package instead:
 *   import { p, l, r, transform, pathBetween, triad } from "tonnetz";
 */
import {
  hexatonicCycle,
  hexatonicPole,
  l,
  p,
  pathBetween,
  r,
  transform,
  triad,
  triadName,
} from "../src/index";

const c = triad(0, "major");
console.log(`start            ${triadName(c)}`);
console.log(`P                ${triadName(p(c))}`);
console.log(`L                ${triadName(l(c))}`);
console.log(`R                ${triadName(r(c))}`);
console.log(`hexatonic pole   ${triadName(hexatonicPole(c))}`);
console.log(`transform "LPR"  ${triadName(transform(c, "LPR"))}`);

console.log("\nhexatonic cycle from C major:");
for (const t of hexatonicCycle(c)) console.log(`  ${triadName(t)}`);

const target = triad(5, "minor");
console.log(`\nshortest path C major to ${triadName(target)}: ${pathBetween(c, target)}`);
