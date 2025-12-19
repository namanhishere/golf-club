export const getPaginationRange = (currentPage, totalPages) => {
  // If few pages, show all
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 1. Always include First, Last, Current, Prev, Next
  const desiredPages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1
  ]);

  // 2. Filter invalid pages and sort
  const sortedPages = [...desiredPages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  // 3. Add ellipses
  const result = [];
  let prev = 0;

  for (const page of sortedPages) {
    if (prev > 0) {
      const gap = page - prev;
      if (gap === 2) {
        result.push(prev + 1); // Fill gap of 1
      } else if (gap > 2) {
        result.push('...'); // Add ellipsis
      }
    }
    result.push(page);
    prev = page;
  }

  return result;
};