export interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}
export declare const hdcpVersions: string[];
export declare const HDCP_MIN_VERSION_WITH_4K = "2.2";
export declare const HDCP_MIN_VERSION_WITH_8K = "2.3";
export declare function isUsableStatus(status: MediaKeyStatus): status is "usable";
export declare function getMaxHdcpVersion(versions: CheckHdcpVersion[]): string;
export declare function is4KHdcpSupported(version: string | CheckHdcpVersion[]): boolean;
export declare function is8KHdcpSupported(version: string | CheckHdcpVersion[]): boolean;
export declare function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus>;
export declare function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]>;
export declare function findMaxHdcpVersion(keySystem: string): Promise<{
    version: string;
    status: MediaKeyStatus;
    attempts: CheckHdcpVersion[];
}>;
