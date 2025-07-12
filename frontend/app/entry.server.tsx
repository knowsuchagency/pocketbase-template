import { type AppLoadContext, type EntryContext, ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import { isbot } from "isbot";

export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  reactRouterContext: EntryContext,
  loadContext: AppLoadContext
) {
  const body = await renderToReadableStream(
    <ServerRouter context={reactRouterContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        status = 500;
      },
    }
  );

  // If the request is from a bot, wait for the stream to finish so they can
  // get the full HTML document.
  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(body, { status, headers });
}