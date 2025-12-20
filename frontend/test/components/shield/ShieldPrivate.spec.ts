// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import ShieldPrivate from "../../../app/components/shield/ShieldPrivate.vue";
import render from "../../../test/render";

type ShieldPrivateProps = {
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  type?: "default" | "group";
  iconSize?: string;
};

const createWrapper = async (props: Partial<ShieldPrivateProps> = {}) =>
  await render(ShieldPrivate, {
    props: {
      fontSize: "xs",
      ...props,
    },
  });

// Shield Private Basic Rendering

describe("Shield Private Basic Rendering", () => {
  it("renders by default with correct label and icons", async () => {
    await createWrapper();

    // Uses correct label
    const label = screen.getByText("Private");
    expect(label).toBeTruthy();

    // Uses correct icon (`IconMap.HIDDEN` has aria-label `bi:eye-slash-fill`)
    const icon = screen.getByRole("img", { name: "bi:eye-slash-fill" });
    expect(icon).toBeTruthy();
  });

  it("renders `IconGroup` icon when needed", async () => {
    await createWrapper({ type: "group" });

    const icon = screen.getByRole("img", { name: "IconGroup" });
    expect(icon).toBeTruthy();
  });
});

// Shield Private Visual & Responsive Styling

describe("Shield Private Visual & Responsive Styling", () => {
  const fontSizeClasses = [
    { fontSize: "xs", expectedClasses: ["text-xs"] },
    { fontSize: "sm", expectedClasses: ["text-sm"] },
    { fontSize: "base", expectedClasses: ["text-base"] },
    { fontSize: "lg", expectedClasses: ["text-lg"] },
    {
      fontSize: "xl",
      expectedClasses: [
        "text-base",
        "sm:text-lg",
        "xl:px-6",
        "xl:py-3",
        "xl:text-xl",
      ],
    },
    {
      fontSize: "2xl",
      expectedClasses: [
        "text-base",
        "sm:text-lg",
        "xl:px-6",
        "xl:py-3",
        "xl:text-2xl",
      ],
    },
    {
      fontSize: "3xl",
      expectedClasses: [
        "text-base",
        "sm:text-lg",
        "xl:px-6",
        "xl:py-3",
        "xl:text-3xl",
      ],
    },
  ];

  it.each(fontSizeClasses)(
    "applies responsive classes based on `fontSize`",
    async ({ fontSize, expectedClasses }) => {
      const { container } = await createWrapper({ fontSize });

      const wrapper = container.firstElementChild
        .firstElementChild as HTMLElement;
      const classes = wrapper.classList;

      expectedClasses.forEach((className) => {
        expect(classes.contains(className)).toBeTruthy();
      });
    }
  );
});
