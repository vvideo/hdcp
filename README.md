# HDCP
[![NPM version](https://img.shields.io/npm/v/hdcp.svg?style=flat)](https://www.npmjs.com/package/hdcp)
[![NPM downloads](https://img.shields.io/npm/dm/hdcp.svg?style=flat)](https://www.npmjs.com/package/hdcp)
[![install size](https://packagephobia.com/badge?p=hdcp)](https://packagephobia.com/result?p=hdcp)

Check HDCP version for key system in browser.

[Demo](https://vvideo.github.io/hdcp/index.html)

## Install
`npm i --save-dev hdcp`

## Using
```js
import { checkHdcpVersion, checkAllHdcpVersions, findMaxHdcpVersion } from 'hdcp';

const status = await checkHdcpVersion('com.widevine.alpha', '1.0');
console.log('checkHdcpVersion: ', status);

const allVersions = await checkAllHdcpVersions('com.microsoft.playready.recommendation');
console.log('checkAllHdcpVersions: ', allVersions);

// More efficient (binary) search for supported HDCP version
// if full status for all HDCP versions is not needed.
const data = findMaxHdcpVersion('com.widevine.alpha');
console.log('HDCP version: ', data.version);
```

## Links
- [Wikipedia: HDCP](https://en.wikipedia.org/wiki/High-bandwidth_Digital_Content_Protection)
- [HDCP Specifications](https://www.digital-cp.com/hdcp-specifications)
- [Encrypted Media: HDCP Policy Check](https://w3c.github.io/encrypted-media/#dom-mediakeys-getstatusforpolicy)
