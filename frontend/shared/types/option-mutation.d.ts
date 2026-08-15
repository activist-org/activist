// SPDX-License-Identifier: AGPL-3.0-or-later
interface OptionCrudMutation {
  onSuccess?: (data?: unknown) => void | Promise<void>;
  onError?: () => void | Promise<void>;
  onSettled?: () => void | Promise<void>;
}

export interface OptionMutation {
  create?: OptionCrudMutation;
  update?: OptionCrudMutation;
  delete?: OptionCrudMutation;
  reorder?: OptionCrudMutation;
  [key: string]: OptionCrudMutation | undefined;
}
