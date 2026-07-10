function weightedRandom(array) {

  const counts = new Map();

  for (const value of array) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  const entries = [...counts.entries()];
  const total = entries.reduce((a, b) => a + b[1], 0);

  let r = Math.random() * total;

  for (const [value, weight] of entries) {

    r -= weight;

    if (r <= 0)
      return value;
  }

  return entries[0][0];
}

module.exports = {
  weightedRandom
};