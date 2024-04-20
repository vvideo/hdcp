export declare const hdcpVersions: string[];
export declare const HDCP_MIN_VERSION_WITH_UHD = "2.2";
export declare function getMaxHdcpVersion(versions: CheckHdcpVersion[]): string;
export declare function isUhdHdcpSupported(versions: CheckHdcpVersion[]): boolean;
export declare function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus>;
export interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}
export declare function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]>;
