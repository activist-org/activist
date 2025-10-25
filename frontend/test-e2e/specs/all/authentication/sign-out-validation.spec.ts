import { signOut } from "~/test-e2e/actions/authentication";
import { expect, test } from "~/test-e2e/global-fixtures";

test.describe("Sign out", () => {
  test(
    "User can sign out successfully",
    { tag: ["@desktop", "@mobile"] },
    async ({ page }) => {
      const cookiesSignIn = await page.context().cookies();
      const sessionCookie = cookiesSignIn.find((c) => c.name === "auth.token");
      expect(sessionCookie).toBeDefined();
      await signOut(page);
      const cookiesSignOut = await page.context().cookies();
      const sessionCookieUndefined = cookiesSignOut.find(
        (c) => c.name === "auth.token"
      );
      expect(sessionCookieUndefined).toBeUndefined();
    }
  );
});
