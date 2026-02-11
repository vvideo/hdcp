# HDCP
[![NPM version](https://img.shields.io/npm/v/hdcp.svg?style=flat)](https://www.npmjs.com/package/hdcp)
[![NPM downloads](https://img.shields.io/npm/dm/hdcp.svg?style=flat)](https://www.npmjs.com/package/hdcp)
[![install size](https://packagephobia.com/badge?p=hdcp)](https://packagephobia.com/result?p=hdcp)

Check HDCP version for a key system in browser.

[Demo](https://vvideo.github.io/hdcp/index.html)

## Install
`npm i --save-dev hdcp`

## [Supported Browsers](https://developer.mozilla.org/en-US/docs/Web/API/MediaKeys/getStatusForPolicy#browser_compatibility)

⚠️ Please note that Safari currently does not support HDCP version detection.

## Using
```js
import { canDetectHdcpVersion, checkHdcpVersion, checkAllHdcpVersions } from 'hdcp';

console.log('Can detect HDCP version: ', canDetectHdcpVersion());

const status = await checkHdcpVersion('com.widevine.alpha', '1.0');
console.log('checkHdcpVersion: ', status);

const allVersions = await checkAllHdcpVersions('com.microsoft.playready.recommendation');
console.log('checkAllHdcpVersions: ', allVersions);
```

## Links
- [Wikipedia: HDCP](https://en.wikipedia.org/wiki/High-bandwidth_Digital_Content_Protection)
- [HDCP Specifications](https://www.digital-cp.com/hdcp-specifications)
- [Encrypted Media: HDCP Policy Check](https://w3c.github.io/encrypted-media/#dom-mediakeys-getstatusforpolicy)
