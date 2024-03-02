export declare const hdcpVersions: string[];
export declare function isHdcpVersionSupported(keySystem: string, hdcpVersion: string): Promise<boolean>;
interface HdcpVersion {
    min: string;
    max: string;
}
export declare function getHdcpVersion(): Promise<HdcpVersion | null>;
export {};
