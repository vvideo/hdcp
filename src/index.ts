// https://w3c.github.io/encrypted-media/#dom-mediakeys-getstatusforpolicy

export interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}

export const hdcpVersions = [
    '1.0',
    '1.1',
    '1.2',
    '1.3',
    '1.4',
    '2.0',
    '2.1',
    '2.2', // 4K
    '2.3', // 8K
];

const defaultConfig = [{
    videoCapabilities: [{
        contentType: 'video/mp4; codecs="avc1.42E01E"',
    }],
}];

export const HDCP_MIN_VERSION_WITH_4K = '2.2';
export const HDCP_MIN_VERSION_WITH_8K = '2.3';

export function canDetectHdcpVersion() {
    return Boolean(
        window.MediaKeys &&
        typeof window.MediaKeys.prototype.getStatusForPolicy === 'function'
    );
}

export function isUsableStatus(status: MediaKeyStatus) {
    return status === 'usable';
}

export function getMaxHdcpVersion(versions: CheckHdcpVersion[]): string {
    for (let i = versions.length - 1; i >= 0; i--) {
        const item = versions[i];
        if (isUsableStatus(item.status)) {
            return item.version;
        }
    }

    return '';
}

export function is4KHdcpSupported(version: string | CheckHdcpVersion[]): boolean {
    const maxVersion = Array.isArray(version) ? getMaxHdcpVersion(version) : version;

    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_4K) :
        false;
}

export function is8KHdcpSupported(version: string | CheckHdcpVersion[]): boolean {
    const maxVersion = Array.isArray(version) ? getMaxHdcpVersion(version) : version;

    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_8K) :
        false;
}

export function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus> {
    if (!canDetectHdcpVersion()) {
        const error = new Error('MediaKeys.prototype.getStatusForPolicy is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);
    }

    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => mediaKeys.getStatusForPolicy({ minHdcpVersion: version }));
}

export function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]> {
    if (!canDetectHdcpVersion()) {
        const error = new Error('MediaKeys.prototype.getStatusForPolicy is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);
    }

    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
            const promises: Promise<CheckHdcpVersion>[] = [];
            hdcpVersions.forEach(minHdcpVersion => {
                promises.push(
                    mediaKeys.getStatusForPolicy({ minHdcpVersion }).then(status => ({
                        version: minHdcpVersion,
                        status,
                    }))
                );
            });

            return Promise.all(promises);
        });
}
