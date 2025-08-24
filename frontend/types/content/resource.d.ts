// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Location } from "~/types/content/location";

import type { Organization } from "../communities/organization";

// MARK: Main Table

export interface Resource {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  org?: Organization;
  location?: Location;
  url: string;
  // isPrivate?: boolean;
  creationDate?: string;
  // lastUpdated?: string;
}
