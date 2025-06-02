import { it, expect, describe } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CameraList from "./CameraList.vue";

describe("CameraList", () => {
  it("should render the component", async () => {
    const component = await mountSuspended(CameraList);
    expect(component.html()).toContain("Receiving Dock");
  });
});
