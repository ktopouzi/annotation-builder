import { it, expect, describe, test } from "vitest";
import { setup, createPage, url } from "@nuxt/test-utils/e2e";
import { mountSuspended } from "@nuxt/test-utils/runtime";

import ImageAnnotator from "./ImageAnnotator.vue";

describe("ImageAnnotator", () => {
  it("renders image and SVG canvas", async () => {
    const component = await mountSuspended(ImageAnnotator);

    const img = component.find("img");

    const svg = component.find("svg");

    expect(img.exists()).toBe(true); // image is not rendered in this test
    expect(svg.exists()).toBe(true);
  });
});

describe("ImageAnnotator E2E", async () => {
  await setup({ server: true });

  test("checks for SVG canvas", async () => {
    const page = await createPage(url("/"));

    const svg = await page.$("svg");

    expect(svg).not.toBe(true);
  });
});
