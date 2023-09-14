export const addSearchParams = (
  queries: {
    name: string;
    value: string | undefined;
  }[]
) => {
  const newURL = new URL(window.location.href);
  const searchParams = new URLSearchParams(newURL.search);

  queries
    .filter((item) => Boolean(item.value))
    .forEach((query) => {
      searchParams.set(query.name, query.value as string);
    });

  newURL.search = searchParams.toString();

  // we only need searchParams
  return newURL.search.toString();
};
