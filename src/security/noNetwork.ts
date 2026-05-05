import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type HttpModule = typeof import("node:http");
type HttpsModule = typeof import("node:https");
type NetModule = typeof import("node:net");
type TlsModule = typeof import("node:tls");

let installed = false;

export function installNoNetworkGuard(): void {
  if (installed) {
    return;
  }

  installed = true;

  const http = require("node:http") as HttpModule;
  const https = require("node:https") as HttpsModule;
  const net = require("node:net") as NetModule;
  const tls = require("node:tls") as TlsModule;

  http.request = blocked("http.request") as typeof http.request;
  http.get = blocked("http.get") as typeof http.get;
  https.request = blocked("https.request") as typeof https.request;
  https.get = blocked("https.get") as typeof https.get;
  net.connect = blocked("net.connect") as typeof net.connect;
  net.createConnection = blocked("net.createConnection") as typeof net.createConnection;
  tls.connect = blocked("tls.connect") as typeof tls.connect;

  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: blocked("fetch")
  });
}

export function isNoNetworkGuardInstalled(): boolean {
  return installed;
}

function blocked(apiName: string): (...args: unknown[]) => never {
  return () => {
    throw new Error(
      `Chamada de rede bloqueada em runtime: ${apiName}. Esta ferramenta deve operar localmente/offline.`
    );
  };
}
