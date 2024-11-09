const { count } = require("console");
const fs = require("fs");
const { totalmem } = require("os");
const logHeaderPrefix = "EverybodyCodes";
const challengeDayNo = "20241106";
const challengeTitle = "The Runes of Power";

let p1Data, p2Data, p3Data;

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

const parseInput = (rawInputData) => {
  const [runicRef, inscription] = rawInputData.split("\n\n");
  runicWords = runicRef.split(":").at(-1).split(",");

  return { runicWords, inscription };
};

const getRunicWordCount = (inputData) => {
  const { runicWords, inscription } = parseInput(inputData);

  return runicWords
    .map((runicWord) => {
      const searchParam = new RegExp(`(${runicWord})`, "g");
      return Array.from(inscription.matchAll(searchParam)).length;
    })
    .reduce(
      (totalRunicWordCount, runicWordCount) =>
        (totalRunicWordCount += runicWordCount),
      0,
    );
};

const getRunicWordVariants = (runicWords) => {
  const reversedRunicWords = runicWords.map((runicWord) =>
    [...runicWord].reverse().join(""),
  );

  return Array.from(new Set(runicWords.concat(reversedRunicWords)));
};

const getMatchedRunesCoords = (
  runicWords,
  inscription,
  loopToStart = false,
  switchedAxes = false,
) => {
  const runicWordsRef = getRunicWordVariants(runicWords);

  const runeCounts = inscription.split("\n").flatMap((line, lineIndex) => {
    const lineLength = line.length;
    const lineRef = loopToStart ? [line, line].join("") : line;

    const runicCharIndexes = runicWordsRef.flatMap((runicWord) => {
      const searchParam = new RegExp(`(?=(?<digitMatch>(${runicWord})))`, "g");

      const runicWordIndeces = Array.from(
        lineRef.matchAll(searchParam),
        ({ index }) => (index >= lineLength ? index % lineLength : index),
      );

      const indexList = runicWordIndeces
        .flatMap((indexRef) =>
          Array(runicWord.length)
            .fill(indexRef)
            .map((value, index) => {
              let newIndex = value + index;
              newIndex =
                newIndex >= lineLength ? newIndex % lineLength : newIndex;
              return switchedAxes
                ? `${newIndex}|${lineIndex}`
                : `${lineIndex}|${newIndex}`;
            }),
        )
        .flat();

      return indexList;
    });

    return runicCharIndexes.flat();
  });

  return runeCounts;
};

const transposeInscription = (sourceData) => {
  if (!sourceData.length) return [];
  const parsedData = sourceData.split("\n").map((line) => line.split(""));

  return parsedData[0]
    .map((_, colIndex) => parsedData.map((row) => row[colIndex]).join(""))
    .join("\n");
};

const solveP2 = (inputData) => {
  const { runicWords: origRunicWords, inscription } = parseInput(inputData);
  const runicWords = getRunicWordVariants(origRunicWords);

  const matchedRuneCoords = getMatchedRunesCoords(runicWords, inscription);
  const uniqueMatchedRunes = new Set(matchedRuneCoords);

  return uniqueMatchedRunes.size;
};

const solveP3 = (inputData) => {
  const { runicWords: origRunicWords, inscription } = parseInput(inputData);
  const runicWords = getRunicWordVariants(origRunicWords);
  const transposedInscription = transposeInscription(inscription);

  const [matchedRuneCoords1, matchedRuneCoords2] = [
    getMatchedRunesCoords(runicWords, inscription, true, false),
    getMatchedRunesCoords(runicWords, transposedInscription, false, true),
  ];

  const uniqueMatchedRunes = new Set(
    matchedRuneCoords1.concat(matchedRuneCoords2),
  );

  return uniqueMatchedRunes.size;
};

const t1 = performance.now();

if (p1Data) console.info(`P1 : ${getRunicWordCount(p1Data)}`); //  33
if (p2Data) console.info(`P2 : ${solveP2(p2Data)}`); //  5139
if (p3Data) console.info(`P3 : ${solveP3(p3Data)}`); //

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
