import { describe, expect, it, vi } from "vitest";
import { GOOGLE_FONTS } from "../data/google-fonts";
import { googleFontsApiProvider } from "./google-api";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("googleFontsApiProvider", () => {
  it("fetches and maps the live catalog", async () => {
    const fetchImpl = vi.fn((_url: string) =>
      Promise.resolve(
        jsonResponse({
          items: [
            { family: "Inter", category: "sans-serif" },
            { family: "Lobster", category: "display" },
            { family: "Weird", category: "unknown-category" },
          ],
        }),
      ),
    );
    const provider = googleFontsApiProvider({ apiKey: "k", fetch: fetchImpl });

    const fonts = await provider.listFonts();
    expect(fonts).toEqual([
      { family: "Inter", category: "sans-serif" },
      { family: "Lobster", category: "display" },
      { family: "Weird", category: undefined },
    ]);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const url = fetchImpl.mock.calls[0]?.[0] ?? "";
    expect(url).toContain("key=k");
    expect(url).toContain("sort=popularity");
  });

  it("caches the catalog across calls", async () => {
    const fetchImpl = vi.fn((_url: string) => Promise.resolve(jsonResponse({ items: [] })));
    const provider = googleFontsApiProvider({ apiKey: "k", fetch: fetchImpl });
    await provider.listFonts();
    await provider.listFonts();
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("falls back to the bundled list on a failed request", async () => {
    const fetchImpl = vi.fn((_url: string) => Promise.resolve(jsonResponse({}, false, 403)));
    const provider = googleFontsApiProvider({ apiKey: "bad", fetch: fetchImpl });
    const fonts = await provider.listFonts();
    expect(fonts).toEqual([...GOOGLE_FONTS]);
  });

  it("falls back when fetch throws", async () => {
    const fetchImpl = vi.fn((_url: string) => Promise.reject(new Error("network")));
    const provider = googleFontsApiProvider({ apiKey: "k", fetch: fetchImpl });
    const fonts = await provider.listFonts();
    expect(fonts).toEqual([...GOOGLE_FONTS]);
  });
});
