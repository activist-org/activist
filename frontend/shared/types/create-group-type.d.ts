// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContextCreateGroupData {
  [CreateGroupSteps.GroupDetails]: {
    tagline?: string;
    name: string;
    description: string;
    org: string;
  };
  [CreateGroupSteps.Location]: {
    countryCode: string;
    city: string;
  };
}
