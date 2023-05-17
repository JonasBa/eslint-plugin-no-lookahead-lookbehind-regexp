import Benchmark from "benchmark";
import { ESLint } from "eslint";
import fs from "fs";

// Save the contents of our old pkg json to a variable
const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf8").toString());
process.on("uncaughtException", () => {
  fs.writeFileSync("./package.json", JSON.stringify({ ...packageJSON }, undefined, 2));
});

const config = {
  baseConfig: {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: ["plugin:eslint-plugin/recommended", "plugin:prettier/recommended"],
    env: {
      browser: true,
    },
  },
};

const eslint = new ESLint(config);
const benchmark = new Benchmark(
  "ESLint self benchmark w/o browserslist",
  (deferred: { resolve: Function }) => {
    eslint
      .lintFiles("src/**/*.ts")
      .then(() => {
        return deferred.resolve();
      })
      .catch((e) => {
        throw e;
      });
  },
  {
    onStart: () => {
      console.log(`Starting ESLint self benchmark`);
    },
    onComplete: () => {
      console.log(`Completed benchmark`);
    },
    onError: () => {
      console.error(benchmark.error);
    },
    async: true,
    defer: true,
    maxTime: 5,
  }
);

fs.writeFileSync(
  "./package.json",
  JSON.stringify({ ...packageJSON, browserslist: ["Safari 13"] }, undefined, 2)
);

eslint
  .lintFiles("src/**/*.ts")
  .then((data: ESLint.LintResult[]) => {
    data.forEach((d) => console.log(d.messages.map((m) => m.message).join(", ")));
  })
  .catch((e) => {
    throw e;
  });

const browserlistBenchmark = new Benchmark(
  "ESLint self benchmark with browserslist",
  (deferred: { resolve: Function; reject: Function }) => {
    eslint
      .lintFiles("src/**/*.ts")
      .then(() => {
        return deferred.resolve();
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  },
  {
    onStart: () => {
      console.log(`Starting ESLint self benchmark`);
    },
    onComplete: () => {
      console.log(`Completed benchmark`);
    },
    onError: () => {
      console.error(benchmark.error);
    },
    async: true,
    defer: true,
    maxTime: 5,
  }
);

Benchmark.invoke([benchmark, browserlistBenchmark], {
  name: "run",
  async: true,
  onStart: () => console.log("Starting benchmark suite"),
  onComplete: (e: any) => {
    console.log("Finished benchmark suite");
    const reports = e.currentTarget.map((benchmark: any) => ({
      name: benchmark.name,
      stats: benchmark.stats,
      sample: benchmark.stats.sample,
      sampleCount: benchmark.stats.sample.length,
    }));
    console.log(reports);
  },
});

fs.writeFileSync("./package.json", JSON.stringify({ ...packageJSON }, undefined, 2));
