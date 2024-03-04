export declare const hdcpVersions: string[];
export declare function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus>;
interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}
export declare function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]>;
export {};
