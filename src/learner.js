const constants = require("./constants");

class Learner {

  constructor(order = constants.ORDER) {
    this.order = order;
    this.model = {};
  }

  /**
   * 1文を学習する
   * @param {Array} tokens
   */
  learnSentence(tokens) {

    // START・ENDを付与
    const words = [
      ...Array(this.order).fill(constants.START),
      ...tokens.map(t => t.surface),
      constants.END
    ];

    for (let i = 0; i <= words.length - this.order - 1; i++) {

      const key = words
        .slice(i, i + this.order)
        .join("\u0001");

      const next = words[i + this.order];

      if (!this.model[key]) {

        this.model[key] = {
          total: 0,
          next: {}
        };

      }

      this.model[key].total++;

      this.model[key].next[next] =
        (this.model[key].next[next] || 0) + 1;

    }

  }

  // 複数文を学習
  learn(sentences) {

    for (const sentence of sentences) {
      this.learnSentence(sentence);
    }

  }

}

module.exports = Learner;