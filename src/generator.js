const constants = require("./constants");

class Generator {

  constructor(model, order = constants.ORDER) {
    this.model = model;
    this.order = order;
  }

  // 出現回数に応じて次の単語を選択
  chooseNext(data) {

    const total = data.total;

    let r = Math.random() * total;

    for (const word in data.next) {

      r -= data.next[word];

      if (r < 0) {
        return word;
      }

    }

    return null;
  }

  // 文章生成
  generate() {

    const result = [];

    // STARTのみから開始
    let window = Array(this.order).fill(constants.START);

    while (result.length < constants.MAX_SENTENCE_LENGTH) {

      const key = window.join("\u0001");

      const data = this.model[key];

      if (!data) {
        break;
      }

      const next = this.chooseNext(data);

      if (next === constants.END) {
        break;
      }

      result.push(next);

      window.shift();
      window.push(next);

    }

    return result.join("");

  }

}

module.exports = Generator;