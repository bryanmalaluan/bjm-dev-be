export const assertError = (error: unknown) => {
  return error instanceof Error ? error.message : "Uknown error occured.";
};
