# aframe-audio-components

Ready-to-use component and entities for a A-Frame WebVR framework that allows for the sending and recieving of Open Sound Control (OSC) messages in and out of virtual environments, audio streaming, object riggings, and much more. Our custom UI entities and example A-Frame environment to engage with these components to provide a boilerplate to build off of.

## Getting Started

Whether you want to contribute or simply use these components for your own personal use, the [Quick Start Guide](#quick-start-guide) will help you get set up. 


### Quick Start

First, clone the repository  to your computer by downloading and extracting the zip file or by running the following commands:

```
git clone https://github.com/RCOS-Virtual-Music/aframe-audio-components.git
cd aframe-audio-components
```

#### Launching the Web Client (Python)

To get started, make sure you have the following installed: <br/>

* Python 3.0 (you can download it [here](www.python.org/downloads/))

Using your terminal, navigate to the `aframe-audio-components/` directory. To launch the web client, simply run `python -m http.server 8000`. This launches the server on your localhost on port 8000 (default). Open [http://localhost:8000/](http://localhost:8000/) on any browser of your choosing and you should see the boilerplate scene. 

#### Launching the Web Client (VS Code Live Server)
Live Server is a VS Code extension that allows you to launch a local development Server with live reload feature for static & dynamic pages.
These instructions are for starting and running a server *if* you have a HTML file for your project. 

For serverside code such as `PHP`, `.NET` or `NodeJS` files, you will need to host your own server and additionally download the Live Server browser extension following [these instructions]():

1. Install VS Code (a text edittor from Microsoft). [VS Code](https://code.visualstudio.com/download) from Microsoft. <sup>(code editor)</sup>
2. Install the VS Code extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). <sup>(extension to code editor)</sup>
3. Open up a project in VS Code.
4. At the bottom right handside of the status bar, there should be a button to `Go Live.` Click to turn this server on/off.
5. Right click on a `HTML` file from the Explorer window and click on `Open with Live Server.`

This should automatically open up the scene in a browser window.


#### Launching the Bridge Server
When using these components for OSC communication, a bridge server is needed to pipe data from your local OSC application to a client's web browser. In order to host this bridge server on your local machine, make sure you have the following installed:

* Node.js and npm (you can find the download instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

Once npm is installed, you will need to navigate to the `aframe-audio-components/` folder and run the following commands:

```
npm install node-osc
npm install socket.io
node bridge.js
```

After these commands, your bridge server should be running! If you ever need to relaunch the server, simply navigate to the proper directory and run `node bridge.js` again. 

#### Setting Up the OSC Client

By design, any application that is capable of sending and recieving UDP messages will be able to serve as the OSC client. If you are using a program such as Max-8, you need to use the `udpsend <Bridge-Host> 3333` and `udpreceive 3334` blocks. Similar functionality can also be achieved on Linux by running the `echo "/command" > /dev/udp/<Bridge-Host>/3333`. By default, `<Bridge-Host>` should be replaces with `127.0.0.1`. If you are not hosting the bridge server on the same machine as that you are sending the OSC commands from, you should replace the `<Bridge-Host>` with the bridge server's IP. Methods to find your server's IP is described in the [Configuring the Hosts](#configuring-the-hosts) section. 

#### Configuring the Hosts

By default, all boilerplate code is setup assuming everything is hosted on a local machine. However, this can be adjusted in the boilerplate code. First, figure out what the IP of the machine you will be using is. If you are on Windows, run `ipconfig` and scroll down until you see your ipv4 address. If you are on Linux, run `ip  -c route` and look for the first colored IP in the format `XXX.XX.X.XXX`.  If the machine will be hosting the bridge server, then this is IP will be your bridge host. If the machine will be
hosting the OSC client, then this is IP will be your OSC host. Once you have found both the OSC and bridge host IPs, you can edit the `index.html` file in the `aframe-audio-components/`directory in the three spots as shown below:

```html
...
<script src="http://<Bridge-Host>:8081/socket.io/socket.io.js"></script>
...
<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" osc-manager="oscHost: <OSC-Host>; bridgeHost: <Bridge-Host>"></a-cylinder>
```




## References 
+ [Open Sound Control Web Bridge](https://github.com/automata/osc-web)
