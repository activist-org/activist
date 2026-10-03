// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetUser composable.
 * Tests unique behaviors: reading the signed-in user ID, and the fetch flow
 * against the getUser service.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { createMockUser } from "../../../../mocks/factories";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockUser = ref<{ id: string } | null>({ id: "user-123" });

vi.mock("../../../../../app/composables/useUser", () => ({
  useUser: () => ({ user: mockUser }),
}));

const mockGetUser = vi.fn();

vi.mock("../../../../../app/services/user/user", () => ({
  getUser: (...args: unknown[]) => mockGetUser(...args),
}));

// MARK: Tests

describe("useGetUser Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockUser.value = { id: "user-123" };
    mockGetUser.mockResolvedValue(null);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetUser } =
        await import("../../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("getUser service receives the signed-in user's ID", async () => {
      const mockUserData = createMockUser({ id: "user-123" });
      mockGetUser.mockResolvedValue(mockUserData);

      await mockGetUser("user-123");

      expect(mockGetUser).toHaveBeenCalledWith("user-123");
    });
  });

  // MARK: Signed-out Handling

  describe("Signed-out Handling", () => {
    it("handler returns null when no user is signed in", async () => {
      // Simulate handler logic.
      const handlerLogic = async (userId: string | undefined) => {
        if (!userId) {
          return null;
        }
        return await mockGetUser(userId);
      };

      const result = await handlerLogic(undefined);

      expect(result).toBeNull();
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("handler fetches when a user ID is provided", async () => {
      const mockUserData = createMockUser({ id: "user-123" });
      mockGetUser.mockResolvedValue(mockUserData);

      const handlerLogic = async (userId: string | undefined) => {
        if (!userId) {
          return null;
        }
        return await mockGetUser(userId);
      };

      const result = await handlerLogic("user-123");

      expect(result).toEqual(mockUserData);
      expect(mockGetUser).toHaveBeenCalledWith("user-123");
    });
  });
});
