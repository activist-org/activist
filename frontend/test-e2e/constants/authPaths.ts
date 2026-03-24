// SPDX-License-Identifier: AGPL-3.0-or-later
import path from "path";

const AUTH_DIR = path.join(__dirname, "..", ".auth");

export const ADMIN_AUTH_STATE_PATH = path.join(AUTH_DIR, "admin.json");
export const MEMBER_AUTH_STATE_PATH = path.join(AUTH_DIR, "member.json");
