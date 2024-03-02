// https://wicg.github.io/hdcp-detection/
const hdcpVersions = [
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
function isHdcpVersionSupported(keySystem, hdcpVersion) {
    const config = [{
            videoCapabilities: [{
                    contentType: 'video/mp4; codecs="avc1.42E01E"',
                }],
        }];
    return navigator.requestMediaKeySystemAccess(keySystem, config)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
        if (!('getStatusForPolicy' in mediaKeys)) {
            return false;
        }
        // @ts-ignore
        return mediaKeys.getStatusForPolicy({ minHdcpVersion: hdcpVersion });
    })
        .then(status => status === 'usable')
        .catch(() => false);
}
function getHdcpVersion() {
    const promises = [];
    hdcpVersions.forEach(version => {
        promises.push(isHdcpVersionSupported('com.widevine.alpha', version));
    });
    return Promise.all(promises).then(result => {
        let min = '';
        let max = '';
        result.forEach((supported, i) => {
            if (supported) {
                if (!min) {
                    min = hdcpVersions[i];
                }
                max = hdcpVersions[i];
            }
        });
        return min ? {
            min,
            max,
        } : null;
    });
}

export { getHdcpVersion, hdcpVersions, isHdcpVersionSupported };
