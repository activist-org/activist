import type { MachineDefinition, StateConfig } from "#shared/types/machine-type";
export function defineFlowMachine<T extends string>(
  config: MachineDefinition<T>
): MachineDefinition<T> {
  const stepNumbers = new Set<number>();

  for (const [nodeId, nodeConfig] of Object.entries<StateConfig<T>>(config.states)) {
    // Validate unique step numbers for screen nodes at runtime
    if (nodeConfig.type !== "logic" && nodeConfig.step) {
      const stepVal = typeof nodeConfig.step === 'function' ? nodeConfig.step() : nodeConfig.step;
      if (stepNumbers.has(stepVal)) {
        console.warn(`[Flow] Duplicate step number ${stepVal} on node '${nodeId}'.`);
      }
      stepNumbers.add(stepVal);
    }
  }

  return config;
}
