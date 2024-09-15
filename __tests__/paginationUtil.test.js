import { getPagination, getPagingData } from "../app/utils/paginationUtil.js";

describe("Pagination Util", () => {
  it("should get pagination object", () => {
    const pagination = getPagination({ page: 1, size: 10 });

    expect(pagination).toEqual({ limit: 10, offset: 0 });
  });

  it("should get paginated data", () => {
    const paginatedData = {
      count: 100,
      rows: [],
    };
    const paginationData = getPagingData({
      paginatedData,
      page: 1,
      limit: 10,
    });

    expect(paginationData).toEqual({
      totalItems: 100,
      data: [],
      totalPages: 10,
      currentPage: 1,
    });
  });
});
