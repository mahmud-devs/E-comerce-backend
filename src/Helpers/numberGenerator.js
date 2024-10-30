const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

const numberGenerate = async () => {
  const generator1 = await aleaRNGFactory(new Date());

  return generator1.uInt32().toString().slice(0,5);
};

module.exports = { numberGenerate };
