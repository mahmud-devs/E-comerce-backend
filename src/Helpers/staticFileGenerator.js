const StaticFileGenerator = (allImage) => {
  const allImageWitthDomain = allImage.map((image) => {
    return `${process.env.DOMAIN}/${image.filename}`;
  });
  return allImageWitthDomain;
};

module.exports = { StaticFileGenerator };
