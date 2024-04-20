// https://wicg.github.io/hdcp-detection/

export const hdcpVersions = [
    '1.0',
    '1.1',
    '1.2',
    '1.3',
    '1.4',
    '2.0',
    '2.1',
    '2.2', // Ultra HD 4K
    '2.3',
];

export const HDCP_MIN_VERSION_WITH_UHD = '2.2';

export function getMaxHdcpVersion(versions: CheckHdcpVersion[]) {
    for (let i = versions.length - 1; i >= 0; i--) {
        const item = versions[i];
        if (item.status === 'usable') {
            return item.version;
        }
    }

    return '';
}

export function isUhdHdcpSupported(versions: CheckHdcpVersion[]) {
    const maxVersion = getMaxHdcpVersion(versions);

    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_UHD) :
        false;
}

const defaultConfig = [{
    videoCapabilities: [{
        contentType: 'video/mp4; codecs="avc1.42E01E"',
    }],
}];

export function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus> {
    if (typeof window.navigator.requestMediaKeySystemAccess !== 'function') {
        const error = new Error('navigator.requestMediaKeySystemAccess is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);    
    }

    return window.navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
            if (!('getStatusForPolicy' in mediaKeys)) {
                const error = Error('Method getStatusForPolicy is not supported');
                error.name = 'NotSupportedError';
                throw error;
            }

            // @ts-ignore
            return mediaKeys.getStatusForPolicy({ minHdcpVersion: version });
        });
}

export interface CheckHdcpVersion {
    version: string;
    status: MediaKeyStatus;
}

export function checkAllHdcpVersions(keySystem: string): Promise<CheckHdcpVersion[]> {
    if (typeof window.navigator.requestMediaKeySystemAccess !== 'function') {
        const error = new Error('navigator.requestMediaKeySystemAccess is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);    
    }

    return window.navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
            if (!('getStatusForPolicy' in mediaKeys)) {
                const error = Error('Method getStatusForPolicy is not supported');
                error.name = 'NotSupportedError';
                throw error;
            }

            const promises: Promise<CheckHdcpVersion>[] = [];
            hdcpVersions.forEach(minHdcpVersion => {
                promises.push(
                    // @ts-ignore
                    mediaKeys.getStatusForPolicy({ minHdcpVersion }).then(status => ({
                        version: minHdcpVersion,
                        status,
                    }))
                );
            });

            return Promise.all(promises);
        });
}
