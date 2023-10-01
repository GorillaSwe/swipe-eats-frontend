export const getQueryParam = (queryParams: URLSearchParams, param: string, defaultValue: any) => {
  const value = queryParams.get(param);
  return value !== null ? value : defaultValue;
}