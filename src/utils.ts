import os from "os";

export function getHostIpAddress() {
  const networkInterfaces = os.networkInterfaces();

  // EthernetのIPv4アドレスを優先的に検索
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const interfaceInfo = networkInterfaces[interfaceName];
    if (interfaceInfo) {
      for (const info of interfaceInfo) {
        if (
          info.family === "IPv4" &&
          !info.internal &&
          interfaceName.toLowerCase().includes("ethernet")
        ) {
          return info.address;
        }
      }
    }
  }

  // EthernetのIPv4アドレスが見つからない場合は、他のIPv4アドレスを検索
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const interfaceInfo = networkInterfaces[interfaceName];
    if (interfaceInfo) {
      for (const info of interfaceInfo) {
        if (info.family === "IPv4" && !info.internal) {
          return info.address;
        }
      }
    }
  }

  return null; // IPアドレスが見つからない場合
}
