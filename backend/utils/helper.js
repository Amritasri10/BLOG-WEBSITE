export const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const generateUniqueSlug = async ({ schemaName, title }) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  let finalSlug = slug;
  let isExists = true;
  let counter = 1;

  while (isExists) {
    const existing = await schemaName.findOne({ slug: finalSlug });
    if (!existing) {
      isExists = false;
    } else {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
  }

  return finalSlug;
};
