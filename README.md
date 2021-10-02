# node-red-contrib-anel

> A Node-RED implementation for the Anel Power Control LAN-Outlets.
> (Anel provided by ANEL-Elektronik AG &copy;. I'm not affiliated.)



## issue

If you have problems do not be afraid to open an issue.


## Installation

```sh
cd ~/.node-red
npm install <location of node module>
```

## Requirements
* Firmware 4.5

## Configuration

Set the IP-Address, username and password of your Anel.


## Nodes added by this package

#### - anel-connection

A node that represents a Anel device.
Be sure to create one for an outlet.

```
Host: IP address of the Anel outlet
Port: Normally 80
Username: Normally user7
Password: Normally anel
Interval: Time between status checks.
```

#### - Anel outlet

Control a single outlet of the Anel device.


#### - Anel Io

Control a single io of the Anel device.

#### - Anel Sensors

Receive the sensor states of the Anel device.



License (MIT)
-------------

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
