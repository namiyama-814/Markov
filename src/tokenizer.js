const kuromoji = require("kuromoji");
const path = require("path");

class Tokenizer {

  constructor() {
    this.tokenizer = null;
  }

  // kuromojiを初期化
  async init() {

    if (this.tokenizer) {
      return;
    }

    this.tokenizer = await new Promise((resolve, reject) => {

      kuromoji.builder({
        dicPath: path.join(
          __dirname,
          "../node_modules/kuromoji/dict"
        )
      }).build((err, tokenizer) => {

        if (err) {
          reject(err);
          return;
        }

        resolve(tokenizer);
      });

    });

  }

  // トークンを扱いやすい形式へ変換
  normalizeToken(token) {
    return {
      surface: token.surface_form,
      basic: token.basic_form === "*"
        ? token.surface_form
        : token.basic_form,
      pos: token.pos,
      detail1: token.pos_detail_1,
      reading: token.reading
    };
  }

  // テキストをトークンへ変換
  tokenize(text) {

    if (!this.tokenizer) {
      throw new Error("Tokenizerが初期化されていません");
    }

    return this.tokenizer
      .tokenize(text)
      .map(token => this.normalizeToken(token));

  }

  // 文単位でトークン化
  tokenizeSentences(text) {

    const sentences = text
      .split(/(?<=[。！？])/)
      .map(s => s.trim())
      .filter(Boolean);

    return sentences.map(sentence => this.tokenize(sentence));

  }

}

module.exports = Tokenizer;