// https://wicg.github.io/hdcp-detection/

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

export const HDCP_MIN_VERSION_WITH_4K = '2.2';
export const HDCP_MIN_VERSION_WITH_8K = '2.3';

export function getMaxHdcpVersion(versions: CheckHdcpVersion[]) {
    for (let i = versions.length - 1; i >= 0; i--) {
        const item = versions[i];
        if (item.status === 'usable') {
            return item.version;
        }
    }

    return '';
}

export function is4KHdcpSupported(versions: CheckHdcpVersion[]) {
    const maxVersion = getMaxHdcpVersion(versions);

    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_4K) :
        false;
}

export function is8KHdcpSupported(versions: CheckHdcpVersion[]) {
    const maxVersion = getMaxHdcpVersion(versions);

    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_8K) :
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
                    mediaKeys.getStatusForPolicy({ minHdcpVersion }).then(status => ({
                        version: minHdcpVersion,
                        status,
                    }))
                );
            });

            return Promise.all(promises);
        });
}

export async function findMaxHdcpVersion(keySystem: string): Promise<string> {
    if (typeof window.navigator.requestMediaKeySystemAccess !== 'function') {
        const error = new Error('navigator.requestMediaKeySystemAccess is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);    
    }

    const mediaKeys = await window.navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys());

    if (!('getStatusForPolicy' in mediaKeys)) {
        const error = Error('Method getStatusForPolicy is not supported');
        error.name = 'NotSupportedError';
        throw error;
    }

    let left = 0;
    let right = hdcpVersions.length - 1;
    let maxSupportedVersion = '';

    const maxVersion = hdcpVersions[right];
    const maxStatus = await mediaKeys.getStatusForPolicy({ minHdcpVersion: maxVersion });
    
    if (maxStatus === 'usable') {
        return maxVersion;
    }

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const middleVersion = hdcpVersions[middle];
        
        const midStatus = await mediaKeys.getStatusForPolicy({ minHdcpVersion: middleVersion });

        if (midStatus === 'usable') {
            // Если текущая версия поддерживается, сохраняем её и ищем более высокую
            maxSupportedVersion = middleVersion;
            left = middle + 1;
        } else {
            // Если текущая версия не поддерживается, ищем более низкую
            right = middle - 1;
        }
    }

    return maxSupportedVersion;
}
