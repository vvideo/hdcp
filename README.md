# HDCP

Detect HDCP version for key system in browser.

[Demo](https://vvideo.github.io/hdcp/index.html)

## Install
`npm i --save-dev hdcp`

## Using
```js
import { checkHdcpVersion, checkAllHdcpVersions } from 'hdcp';

const status = await checkHdcpVersion('com.widevine.alpha', '1.0');
console.log('checkHdcpVersion: ', status);

const result = await checkAllHdcpVersions('com.microsoft.playready');
console.log('checkAllHdcpVersions: ', result);
```

## Links
- [Encrypted Media: HDCP Policy Check](https://wicg.github.io/hdcp-detection/)
