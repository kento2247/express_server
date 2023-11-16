"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostIpAddress = void 0;
const os_1 = __importDefault(require("os"));
function getHostIpAddress() {
    const networkInterfaces = os_1.default.networkInterfaces();
    // EthernetのIPv4アドレスを優先的に検索
    for (const interfaceName of Object.keys(networkInterfaces)) {
        const interfaceInfo = networkInterfaces[interfaceName];
        if (interfaceInfo) {
            for (const info of interfaceInfo) {
                if (info.family === "IPv4" &&
                    !info.internal &&
                    interfaceName.toLowerCase().includes("ethernet")) {
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
exports.getHostIpAddress = getHostIpAddress;
