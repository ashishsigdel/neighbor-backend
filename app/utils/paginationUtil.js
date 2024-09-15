/**
 * @description Get pagination object
 * @param {number} page - Page number (default: 1)
 * @param {number} size - Page size (default: 10)
 * @returns {object} - Pagination object
 * @example getPagination({ page: 1, size: 10 }); // returns { limit: 10, offset: 0 }
 */
export const getPagination = ({ page = 1, size = 10 }) => {
  const limit = Math.max(+size, 1); // Ensure size is at least 1
  const offset = (Math.max(+page, 1) - 1) * limit; // Ensure page is at least 1

  return { limit, offset };
};

/**
 * @description Get paginated data
 * @param {object} paginatedData - Paginated data
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Page size (default: 10)
 * @returns {object} - Paginated data
 * @example getPagingData({ paginatedData, page: 1, limit: 10 }); // returns { totalItems: 100, data: [], totalPages: 10, currentPage: 1 }
 */

export const getPagingData = ({ paginatedData, page = 1, limit = 10 }) => {
  const currentPage = Math.max(+page, 1); // Ensure page is at least 1
  const itemsPerPage = Math.max(+limit, 1); // Ensure limit is at least 1

  if (!paginatedData) return null;

  const { count: totalItems, rows: data } = paginatedData;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return { totalItems, data, totalPages, currentPage };
};
