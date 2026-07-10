const fs = require("fs");

const Tokenizer = require("./src/tokenizer");
const Learner = require("./src/learner");
const Generator = require("./src/generator");

(async () => {

  const tokenizer = new Tokenizer();

  await tokenizer.init();

  const text = fs.readFileSync("sample.txt", "utf8");

  const sentences =
    tokenizer.tokenizeSentences(text);

  const learner = new Learner();

  learner.learn(sentences);

  const generator =
    new Generator(learner.model);

  console.log("====== 生成結果 ======");

  for (let i = 0; i < 10; i++) {

    console.log(generator.generate());

  }

})();