import {
    CheckHdcpVersion,
    hdcpVersions,
    getMaxHdcpVersion,
    is4KHdcpSupported,
    is8KHdcpSupported,
    checkHdcpVersion,
    checkAllHdcpVersions,
    isUsableStatus
} from '../src/index';

const mockRequestMediaKeySystemAccess = jest.fn();
const mockGetStatusForPolicy = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    if (global.window) {
        global.window.navigator.requestMediaKeySystemAccess = mockRequestMediaKeySystemAccess;
        // @ts-ignore
        global.window.MediaKeys = {};
        // @ts-ignore
        global.window.MediaKeys.prototype = {
            getStatusForPolicy: mockGetStatusForPolicy,
        };
    }
});

describe('isUsableStatus', () => {
    it('should return true for "usable" status', () => {
        expect(isUsableStatus('usable')).toBe(true);
    });

    it('should return false for other statuses', () => {
        expect(isUsableStatus('expired')).toBe(false);
        expect(isUsableStatus('released')).toBe(false);
        expect(isUsableStatus('output-restricted')).toBe(false);
        expect(isUsableStatus('output-downscaled')).toBe(false);
        expect(isUsableStatus('status-pending')).toBe(false);
        expect(isUsableStatus('internal-error')).toBe(false);
    });
});

describe('getMaxHdcpVersion', () => {
    it('should return the highest usable version', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '1.0', status: 'usable' },
            { version: '1.1', status: 'expired' },
            { version: '1.2', status: 'usable' },
            { version: '1.3', status: 'output-restricted' },
            { version: '2.0', status: 'usable' },
        ];

        expect(getMaxHdcpVersion(versions)).toBe('2.0');
    });

    it('should return empty string when no usable versions', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '1.0', status: 'expired' },
            { version: '1.1', status: 'output-restricted' },
            { version: '1.2', status: 'internal-error' },
        ];

        expect(getMaxHdcpVersion(versions)).toBe('');
    });

    it('should return empty string for empty array', () => {
        expect(getMaxHdcpVersion([])).toBe('');
    });
});

describe('is4KHdcpSupported', () => {
    it('should return true when version array contains 4K supported version', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '2.2', status: 'usable' },
            { version: '2.3', status: 'usable' },
        ];

        expect(is4KHdcpSupported(versions)).toBe(true);
    });

    it('should return true when string version is 4K supported', () => {
        expect(is4KHdcpSupported('2.2')).toBe(true);
        expect(is4KHdcpSupported('2.3')).toBe(true);
    });

    it('should return false when version array does not contain 4K supported version', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '2.0', status: 'usable' },
            { version: '2.1', status: 'usable' },
        ];

        expect(is4KHdcpSupported(versions)).toBe(false);
    });

    it('should return false when string version is not 4K supported', () => {
        expect(is4KHdcpSupported('2.1')).toBe(false);
        expect(is4KHdcpSupported('')).toBe(false);
    });

    it('should return false when no usable versions', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '2.2', status: 'expired' },
        ];

        expect(is4KHdcpSupported(versions)).toBe(false);
    });
});

describe('is8KHdcpSupported', () => {
    it('should return true when version array contains 8K supported version', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '2.3', status: 'usable' },
        ];

        expect(is8KHdcpSupported(versions)).toBe(true);
    });

    it('should return true when string version is 8K supported', () => {
        expect(is8KHdcpSupported('2.3')).toBe(true);
    });

    it('should return false when version array does not contain 8K supported version', () => {
        const versions: CheckHdcpVersion[] = [
            { version: '2.2', status: 'usable' },
        ];

        expect(is8KHdcpSupported(versions)).toBe(false);
    });

    it('should return false when string version is not 8K supported', () => {
        expect(is8KHdcpSupported('2.2')).toBe(false);
        expect(is8KHdcpSupported('')).toBe(false);
    });
});

describe('checkHdcpVersion', () => {
    beforeEach(() => {
        mockRequestMediaKeySystemAccess.mockClear();
        mockGetStatusForPolicy.mockClear();
    });

    it('should reject when getStatusForPolicy is not supported', async () => {
        const mockMediaKeys = {};
        const mockMediaKeySystemAccess = {
            createMediaKeys: jest.fn().mockResolvedValue(mockMediaKeys),
        };

        mockRequestMediaKeySystemAccess.mockResolvedValue(mockMediaKeySystemAccess);

        // @ts-ignore
        delete window.MediaKeys.prototype.getStatusForPolicy;

        await expect(checkHdcpVersion('com.widevine.alpha', '2.2'))
            .rejects
            .toMatchObject({
                name: 'NotSupportedError',
                message: 'MediaKeys.prototype.getStatusForPolicy is not supported',
            });
    });

    it('should return MediaKeyStatus when successful', async () => {
        const mockMediaKeys = {
            getStatusForPolicy: jest.fn().mockResolvedValue('usable'),
        };
        const mockMediaKeySystemAccess = {
            createMediaKeys: jest.fn().mockResolvedValue(mockMediaKeys),
        };

        mockRequestMediaKeySystemAccess.mockResolvedValue(mockMediaKeySystemAccess);

        const result = await checkHdcpVersion('com.widevine.alpha', '2.2');

        expect(result).toBe('usable');
        expect(mockRequestMediaKeySystemAccess).toHaveBeenCalledWith(
            'com.widevine.alpha',
            expect.any(Array)
        );
        expect(mockMediaKeys.getStatusForPolicy).toHaveBeenCalledWith({
            minHdcpVersion: '2.2',
        });
    });
});

describe('checkAllHdcpVersions', () => {
    it('should reject when getStatusForPolicy is not supported', async () => {
        const mockMediaKeys = {};
        const mockMediaKeySystemAccess = {
            createMediaKeys: jest.fn().mockResolvedValue(mockMediaKeys),
        };

        // @ts-ignore
        delete window.MediaKeys.prototype.getStatusForPolicy;

        mockRequestMediaKeySystemAccess.mockResolvedValue(mockMediaKeySystemAccess);

        await expect(checkAllHdcpVersions('com.widevine.alpha'))
            .rejects
            .toMatchObject({
                name: 'NotSupportedError',
                message: 'MediaKeys.prototype.getStatusForPolicy is not supported',
            });
    });

    it('should return all HDCP versions with their statuses', async () => {
        const mockMediaKeys = {
            getStatusForPolicy: jest.fn()
                .mockResolvedValueOnce('usable')
                .mockResolvedValueOnce('expired')
                .mockResolvedValueOnce('usable')
                .mockResolvedValueOnce('output-restricted')
                .mockResolvedValueOnce('usable')
                .mockResolvedValueOnce('expired')
                .mockResolvedValueOnce('usable')
                .mockResolvedValueOnce('output-restricted')
                .mockResolvedValueOnce('usable'),
        };
        const mockMediaKeySystemAccess = {
            createMediaKeys: jest.fn().mockResolvedValue(mockMediaKeys),
        };

        mockRequestMediaKeySystemAccess.mockResolvedValue(mockMediaKeySystemAccess);

        const result = await checkAllHdcpVersions('com.widevine.alpha');

        expect(result).toHaveLength(hdcpVersions.length);
        expect(result[0]).toEqual({ version: '1.0', status: 'usable' });
        expect(mockMediaKeys.getStatusForPolicy).toHaveBeenCalledTimes(hdcpVersions.length);

        hdcpVersions.forEach(version => {
            expect(mockMediaKeys.getStatusForPolicy).toHaveBeenCalledWith({
                minHdcpVersion: version,
            });
        });
    });
});
