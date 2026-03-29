// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Mock functions for API service calls used in query composable tests.
 */
import { vi } from "vitest";

// MARK: Events

export const mockListEvents = vi.fn();
export const mockGetEvent = vi.fn();

// MARK: Organizations

export const mockListOrganizations = vi.fn();
export const mockGetOrganization = vi.fn();
export const mockListOrganizationsByUserId = vi.fn();
export const mockFetchOrganizationImages = vi.fn();

// MARK: Groups

export const mockListGroups = vi.fn();
export const mockGetGroup = vi.fn();
export const mockFetchGroupImages = vi.fn();

// MARK: Topics

export const mockListTopics = vi.fn();
/**
 * Resets all service mocks - call in afterEach/beforeEach.
 */
export function resetAllServiceMocks() {
  mockListEvents.mockReset();
  mockGetEvent.mockReset();
  mockListOrganizations.mockReset();
  mockGetOrganization.mockReset();
  mockListOrganizationsByUserId.mockReset();
  mockFetchOrganizationImages.mockReset();
  mockListGroups.mockReset();
  mockGetGroup.mockReset();
  mockFetchGroupImages.mockReset();
  mockListTopics.mockReset();
}
