# node-red-contrib-rademacher

> A Node-RED implementation for the Rademacher start2smart bridge.
> (Rademacher provided by RADEMACHER GERÄTE-ELEKTRONIK GmbH &copy;. I'm not affiliated.)



## Issue

If you have problems do not be afraid to create an issue.

## Pull requests

Also feel free to create pull requests!


## Installation

```sh
cd ~/.node-red
npm install <location of node module>
```

## Configuration

Set the IP-Address and password of your start2smart bridge.


## Nodes added by this package

#### - rademacher-bridge

The configuration node for the bridge.

```
Host: IP address of the bridge
Password: Leave blank if you dont use a login
Interval: Time between status checks in seconds
```

#### - rademacher-rollershutter

Control a single roller shutter connected to the bridge

## Example
![example](https://user-images.githubusercontent.com/10551698/135700284-e542398e-b9f2-4ffe-bd59-81c92b994c64.PNG)

## Credits

Thanks to kapet for providing the information needed to write this module!
https://kapet.de/archives/118

License (MIT)
-------------

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
