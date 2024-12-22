const defaultFetch = window.fetch.bind(window);

const scriptCache: { [key: string]: Promise<string> | string } = {};

const isInlineCode = (code: string): boolean => code.startsWith("<");

export function getInlineCode(match: string): string {
  const start = match.indexOf(">") + 1;
  const end = match.lastIndexOf("<");
  return match.substring(start, end);
}

export function getExternalScripts(
  scripts: string[],
  fetch = defaultFetch,
  errorCallback = () => {}
) {
  const fetchScript = (scriptUrl: string) =>
    scriptCache[scriptUrl] ||
    (scriptCache[scriptUrl] = fetch(scriptUrl).then((response) => {
      if (response.status >= 400) {
        errorCallback();
        throw new Error(
          `${scriptUrl} load failed with status ${response.status}`
        );
      }

      return response.text();
    }));

  return Promise.all(
    scripts.map((script) => {
      if (typeof script === "string") {
        if (isInlineCode(script)) {
          return getInlineCode(script);
        } else {
          return fetchScript(script);
        }
      } else {
        const { src, async } = script;
        if (async) {
          return {
            src,
            async: true,
            content: new Promise(() =>
              requestIdleCallback(() => fetchScript(src as string))
            ),
          };
        }

        return fetchScript(src);
      }
    })
  );
}
