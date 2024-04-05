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

const defaultConfig = [{
    videoCapabilities: [{
        contentType: 'video/mp4; codecs="avc1.42E01E"',
    }],
}];


export function checkHdcpVersion(keySystem: string, version: string): Promise<MediaKeyStatus> {
    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
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
    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
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
