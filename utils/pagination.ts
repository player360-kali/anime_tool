type PaginationParams<T> = {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
};

export const paginate = <T>({
  data,
  total,
  page = 1,
  limit = 12,
}: PaginationParams<T>) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(total / limit);

  return {
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    data: paginatedData,
  };
};
