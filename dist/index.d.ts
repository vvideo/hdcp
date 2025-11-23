export declare const hdcpVersions: string[];
export declare const HDCP_MIN_VERSION_WITH_4K = "2.2";
export declare const HDCP_MIN_VERSION_WITH_8K = "2.3";
export declare function getMaxHdcpVersion(versions: CheckHdcpVersion[]): string;
export declare function is4KHdcpSupported(versions: CheckHdcpVersion[]): boolean;
export declare function is8KHdcpSupported(versions: CheckHdcpVersion[]): boolean;
export declare function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus>;
export interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}
export declare function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]>;
export declare function findMaxHdcpVersion(keySystem: string): Promise<string>;
