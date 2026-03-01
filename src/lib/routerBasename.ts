export function getRouterBasename(baseUrl: string, baseUri?: string) {
  if (baseUrl.startsWith("/")) {
    return baseUrl.replace(/\/$/, "");
  }

  if (!baseUri) {
    return "";
  }

  const inferredBaseUrl = new URL("./", baseUri).pathname;
  return inferredBaseUrl === "/" ? "" : inferredBaseUrl.replace(/\/$/, "");
}
