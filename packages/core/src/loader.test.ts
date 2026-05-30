import { beforeEach, describe, expect, it } from "vitest";
import { createGoogleFontLoader, firstFamilyName } from "./loader";

describe("firstFamilyName", () => {
  it("extracts the first family and strips quotes", () => {
    expect(firstFamilyName('"Open Sans", sans-serif')).toBe("Open Sans");
    expect(firstFamilyName("Roboto, Arial, sans-serif")).toBe("Roboto");
    expect(firstFamilyName("Inter")).toBe("Inter");
  });
});

describe("createGoogleFontLoader", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("injects a Google Fonts <link> for a real family", () => {
    const loadFont = createGoogleFontLoader();
    loadFont("Open Sans");
    const link = document.head.querySelector("link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toContain("family=Open+Sans");
    expect(link?.getAttribute("href")).toContain("display=swap");
  });

  it("dedups by family", () => {
    const loadFont = createGoogleFontLoader();
    loadFont("Roboto");
    loadFont("Roboto");
    expect(document.head.querySelectorAll("link").length).toBe(1);
  });

  it("skips system / generic fonts", () => {
    const loadFont = createGoogleFontLoader();
    loadFont("Arial");
    loadFont("sans-serif");
    loadFont("system-ui");
    expect(document.head.querySelectorAll("link").length).toBe(0);
  });

  it("honors a custom display strategy", () => {
    const loadFont = createGoogleFontLoader({ display: "optional" });
    loadFont("Lato");
    expect(document.head.querySelector("link")?.getAttribute("href")).toContain("display=optional");
  });
});
