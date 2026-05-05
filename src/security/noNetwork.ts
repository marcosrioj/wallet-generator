type GlobalFetch = {
  fetch: (...args: unknown[]) => Promise<unknown>;
};

const networkErrorMessage = "Esta ferramenta não permite chamadas de rede em runtime.";

function blockFunction(): never {
  throw new Error(networkErrorMessage);
}

export function enforceNoNetworkRuntime(): void {
  const globalAny = globalThis as unknown as GlobalFetch;
  if (typeof globalAny.fetch === "function") {
    globalAny.fetch = blockFunction;
  }
}
