export declare const hdcpVersions: string[];
interface CheckHdcpVersion {
    version: string;
    status: string;
}
export declare function checkHdcp(keySystem: string): Promise<CheckHdcpVersion[]>;
export {};
