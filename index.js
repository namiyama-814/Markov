const fs = require("fs");
const path = require("path");
const kuromoji = require("kuromoji");

class MarkovChain {
    constructor(order = 2) {
        this.order = order;
        this.chain = new Map();
    }

    train(tokens) {
        for (let i = 0; i < tokens.length - this.order; i++) {
            const key = tokens.slice(i, i + this.order).join("\u0001");
            const next = tokens[i + this.order];

            if (!this.chain.has(key)) {
                this.chain.set(key, []);
            }

            this.chain.get(key).push(next);
        }
    }

    generate(length = 100) {
        const keys = [...this.chain.keys()];
        if (keys.length === 0) return "";

        let current =
            keys[Math.floor(Math.random() * keys.length)].split("\u0001");

        const result = [...current];

        while (result.length < length) {
            const key = current.join("\u0001");
            const candidates = this.chain.get(key);

            if (!candidates || candidates.length === 0) break;

            const next =
                candidates[Math.floor(Math.random() * candidates.length)];

            result.push(next);

            current.shift();
            current.push(next);
        }

        return result.join("");
    }
}

// -----------------------------

const text = fs.readFileSync("sample.txt", "utf8");

kuromoji.builder({
    dicPath: path.join(
        __dirname,
        "node_modules/kuromoji/dict"
    )
}).build((err, tokenizer) => {

    if (err) {
        console.error(err);
        return;
    }

    const tokens = tokenizer.tokenize(text);

    // 表層形のみ使用
    const words = tokens.map(t => t.surface_form);

    const markov = new MarkovChain(2);

    markov.train(words);

    console.log(markov.generate(150));
});