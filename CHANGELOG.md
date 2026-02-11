# 3.1.0
Added extra HDCP version detection check for Safari.

# 3.0.0
Removed `findMaxHdcpVersion()` function, HDCP versions may be supported with gaps.

# 2.0.2
Updated README.md for npmjs.com.

# 2.0.1
Fixes for `findMaxHdcpVersion()`.

# 2.0.0
- Added `findMaxHdcpVersion()` function to quickly find maximum supported HDCP version.
- Replaced `HDCP_MIN_VERSION_WITH_UHD` with `HDCP_MIN_VERSION_WITH_4K`.
- Added `HDCP_MIN_VERSION_WITH_8K` const.
- Added `is8KHdcpSupported()` helper.

# 1.1.0
Added helpers:
- `getMaxHdcpVersion()`
- `isUhdHdcpSupported()`

# 1.0.2
Fix for older browser, `navigator.requestMediaKeySystemAccess is undefined`.

# 1.0.1
Fixed typings.

# 1.0.0
Public release.
