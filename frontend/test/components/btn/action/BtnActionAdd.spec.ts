// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import BtnActionAdd from "../../../../app/components/btn/action/BtnActionAdd.vue";
import render from "../../../render";

const stubs = {
  BtnAction: {
    template: `<button :id="id" :aria-label="ariaLabel">{{ label }}</button>`,
    props: ["id", "ariaLabel", "label", "cta", "fontSize", "iconSize", "leftIcon"],
  },
};

describe("BtnActionAdd", () => {
  beforeEach(() => {
    vi.stubGlobal("useUserSession", () => ({
      loggedIn: ref(true),
      user: ref(null),
      clear: vi.fn(),
    }));
  });

  it("renders the button when canCreate returns true", async () => {
    await render(BtnActionAdd, {
      props: { element: "Event", ariaLabel: "Add event", onClick: vi.fn() },
      global: { stubs },
    });

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("does not render when user is not signed in", async () => {
    vi.stubGlobal("useUserSession", () => ({
      loggedIn: ref(false),
      user: ref(null),
      clear: vi.fn(),
    }));

    await render(BtnActionAdd, {
      props: { element: "Event", ariaLabel: "Add event", onClick: vi.fn() },
      global: { stubs },
    });

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("sets the correct id from the element prop", async () => {
    await render(BtnActionAdd, {
      props: { element: "Event", ariaLabel: "Add event", onClick: vi.fn() },
      global: { stubs },
    });

    expect(document.getElementById("btn-add-event")).toBeTruthy();
  });

  it("calls onClick when button is clicked", async () => {
    const onClick = vi.fn();

    await render(BtnActionAdd, {
      props: { element: "Event", ariaLabel: "Add event", onClick },
      global: { stubs },
    });

    await fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("calls onClick when Enter key is pressed", async () => {
    const onClick = vi.fn();

    await render(BtnActionAdd, {
      props: { element: "Event", ariaLabel: "Add event", onClick },
      global: { stubs },
    });

    await fireEvent.keyDown(screen.getByRole("button"), {
      key: "Enter",
      code: "Enter",
    });

    expect(onClick).toHaveBeenCalledOnce();
  });
});
