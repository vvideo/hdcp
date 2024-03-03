// https://wicg.github.io/hdcp-detection/
export const hdcpVersions = [
    '1.0',
    '1.1',
    '1.2',
    '1.3',
    '1.4',
    '2.0',
    '2.1',
    '2.2',
    '2.3',
];

interface CheckHdcpVersion {
    version: string;
    status: string;
}

export function checkHdcp(keySystem: string): Promise<CheckHdcpVersion[]> {
    const config = [{
        videoCapabilities: [{
            contentType: 'video/mp4; codecs="avc1.42E01E"',
        }],
    }];

    return navigator.requestMediaKeySystemAccess(keySystem, config)
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
