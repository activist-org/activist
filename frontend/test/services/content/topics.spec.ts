// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { Topic } from "../../../shared/types/topics-type";

import { listTopics } from "../../../app/services/content/topics";
import { AppError } from "../../../shared/utils/errorHandler";
import { expectRequest, getFetchCall, setupServiceTestMocks } from "../helpers";

describe("services/content/topics", () => {
  const getMocks = setupServiceTestMocks();

  it("listTopics() GETs /content/topics without auth", async () => {
    const { get } = getMocks();
    const payload: Topic[] = [
      {
        type: 0 as unknown as Topic["type"],
        active: true,
        creation_date: new Date("2024-01-01T00:00:00Z"),
        last_updated: new Date("2024-02-01T00:00:00Z"),
        deprecation_date: undefined,
        id: "t1",
      },
    ];
    get.mockResolvedValueOnce(payload);

    const result = await listTopics();

    expectRequest(get, "/content/topics", "GET");
    const [, opts] = getFetchCall(get);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result).toEqual(payload);
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { get } = getMocks();
    get.mockRejectedValueOnce(new Error("boom"));
    await expect(listTopics()).rejects.toBeInstanceOf(AppError);
  });
});
