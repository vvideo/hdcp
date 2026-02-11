// https://w3c.github.io/encrypted-media/#dom-mediakeys-getstatusforpolicy
const hdcpVersions = [
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
const HDCP_MIN_VERSION_WITH_4K = '2.2';
const HDCP_MIN_VERSION_WITH_8K = '2.3';
function canDetectHdcpVersion() {
    return Boolean(window.MediaKeys &&
        typeof window.MediaKeys.prototype.getStatusForPolicy === 'function');
}
function isUsableStatus(status) {
    return status === 'usable';
}
function getMaxHdcpVersion(versions) {
    for (let i = versions.length - 1; i >= 0; i--) {
        const item = versions[i];
        if (isUsableStatus(item.status)) {
            return item.version;
        }
    }
    return '';
}
function is4KHdcpSupported(version) {
    const maxVersion = Array.isArray(version) ? getMaxHdcpVersion(version) : version;
    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_4K) :
        false;
}
function is8KHdcpSupported(version) {
    const maxVersion = Array.isArray(version) ? getMaxHdcpVersion(version) : version;
    return maxVersion ?
        parseFloat(maxVersion) >= parseFloat(HDCP_MIN_VERSION_WITH_8K) :
        false;
}
function checkHdcpVersion(keySystem, version) {
    if (!canDetectHdcpVersion()) {
        const error = new Error('MediaKeys.prototype.getStatusForPolicy is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);
    }
    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => mediaKeys.getStatusForPolicy({ minHdcpVersion: version }));
}
function checkAllHdcpVersions(keySystem) {
    if (!canDetectHdcpVersion()) {
        const error = new Error('MediaKeys.prototype.getStatusForPolicy is not supported');
        error.name = 'NotSupportedError';
        return Promise.reject(error);
    }
    return navigator.requestMediaKeySystemAccess(keySystem, defaultConfig)
        .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
        .then(mediaKeys => {
        const promises = [];
        hdcpVersions.forEach(minHdcpVersion => {
            promises.push(mediaKeys.getStatusForPolicy({ minHdcpVersion }).then(status => ({
                version: minHdcpVersion,
                status,
            })));
        });
        return Promise.all(promises);
    });
}

export { HDCP_MIN_VERSION_WITH_4K, HDCP_MIN_VERSION_WITH_8K, canDetectHdcpVersion, checkAllHdcpVersions, checkHdcpVersion, getMaxHdcpVersion, hdcpVersions, is4KHdcpSupported, is8KHdcpSupported, isUsableStatus };
