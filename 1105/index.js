const fs = require("fs");
const logHeaderPrefix = "EverybodyCodes";
const challengeDayNo = "20241105";
const challengeTitle = "The Battle for the Farmlands";

let p1Data, p2Data, p3Data;

const BUGS = {
  ANCIENT_ANT: "A",
  BADASS_BEETLE: "B",
  CREEPY_COCKROACH: "C",
  DIABOLICAL_DRAGONFLY: "D",
  NON_BUG: "x",
};

/* [ bug type, # of potions to defeat ]  */
let bugPotionMatrix = new Map([
  [BUGS.ANCIENT_ANT, 0],
  [BUGS.BADASS_BEETLE, 1],
  [BUGS.CREEPY_COCKROACH, 3],
  [BUGS.DIABOLICAL_DRAGONFLY, 5],
]);

/*  [ group size, plus potions per group size ]  */
let plusPotionsPerGroupSizeMatrix = new Map([
  [2, 1],
  [3, 2],
]);

/*  parse spies' data  */
try {
  p1Data = fs.readFileSync(`${__dirname}/p1.txt`, "utf8");
  p2Data = fs.readFileSync(`${__dirname}/p2.txt`, "utf8");
  p3Data = fs.readFileSync(`${__dirname}/p3.txt`, "utf8");
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

console.info(`${logHeaderPrefix} | ${challengeDayNo} : \n${challengeTitle}`);
console.info(`==============================`);

/*  get total required potions according to grouped bug types from spies' data  */
const getTotalPotionsCount = (inputData, maxGroupSize = 1) => {
  const bugTypesSearch = Object.values(BUGS).join("");

  return Array.from(
    inputData.matchAll(
      new RegExp(
        `(?<bugGroup>([${bugTypesSearch}]{${maxGroupSize},${maxGroupSize}}))`,
        "g",
      ),
    ),
    ({ groups: { bugGroup } }) => bugGroup,
  )
    .map((bugGroup) => {
      const cleanBugGroup = bugGroup.replaceAll(BUGS.NON_BUG, "");

      if (!cleanBugGroup.length) return 0;

      if (cleanBugGroup.length === 1) return bugPotionMatrix.get(cleanBugGroup);

      const plusPotionPerBugMember =
        plusPotionsPerGroupSizeMatrix.get(cleanBugGroup.length) ?? 0;

      return cleanBugGroup
        .split("")
        .map((bugType) => bugPotionMatrix.get(bugType) + plusPotionPerBugMember)
        .reduce(
          (totalPotions, potionCount) => (totalPotions += potionCount),
          0,
        );
    })
    .reduce((totalPotions, potionCount) => (totalPotions += potionCount), 0);
};

const t1 = performance.now();

if (p1Data) console.info(`P1 : ${getTotalPotionsCount(p1Data)}`); //  1334
if (p2Data) console.info(`P2 : ${getTotalPotionsCount(p2Data, 2)}`); //  5383
if (p3Data) console.info(`P3 : ${getTotalPotionsCount(p3Data, 3)}`); //  28000

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
