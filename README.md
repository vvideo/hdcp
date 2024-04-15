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
import { checkHdcpVersion, checkAllHdcpVersions } from 'hdcp';

const status = await checkHdcpVersion('com.widevine.alpha', '1.0');
console.log('checkHdcpVersion: ', status);

const result = await checkAllHdcpVersions('com.microsoft.playready.recommendation');
console.log('checkAllHdcpVersions: ', result);
```

## Links
- [Encrypted Media: HDCP Policy Check](https://wicg.github.io/hdcp-detection/)
