// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  MachineDefinition,
  StateConfig,
} from "#shared/types/machine-type";

export function defineFlowMachine<T extends string>(
  config: MachineDefinition<T>
): MachineDefinition<T> {
  const stepNumbers = new Set<number>();

  for (const [nodeId, nodeConfig] of Object.entries<StateConfig<T>>(
    config.states
  )) {
    // Validate unique step numbers for screen nodes at runtime
    if (nodeConfig.type !== "logic" && nodeConfig.step) {
      const stepVal =
        typeof nodeConfig.step === "function"
          ? nodeConfig.step()
          : nodeConfig.step;

      // 1. Check FIRST
      if (stepNumbers.has(stepVal)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[Flow] Duplicate step number ${stepVal} on node '${nodeId}'.`
        );
      }

      // 2. THEN add it to the set for the next loop iteration
      stepNumbers.add(stepVal);
    }
  }

  return config;
}
