# aframe-audio-components

Ready-to-use component and entities for a A-Frame WebVR framework that allows for the sending and recieving of Open Sound Control (OSC) messages in and out of virtual environments, audio streaming, object riggings, and much more. Our custom UI entities and example A-Frame environment to engage with these components to provide a boilerplate to build off of.

## Getting Started

Whether you want to contribute or simply use these components for your own personal use, the [Quick Start](#quick-start) guide will help you get set up. 


### Quick Start

First, clone the repository  to your computer by downloading and extracting the zip file or by running the following commands:

```
git clone https://github.com/RCOS-Virtual-Music/aframe-audio-components.git
cd aframe-audio-components
```

#### Launching the Web Client (Browser)

Locate the `index.html` file in your `aframe-audio-components/` folder and launch it in a web browser of your choice. If you are working on contributing to the package, you might want to look at using one of the [other methods](https://github.com/RCOS-Virtual-Music/aframe-audio-components/tree/documentation/documentation/launching-the-web-client.md) of launching the web client. 

#### Launching the Bridge Server
When using these components for OSC communication, a bridge server is needed to pipe data from your local OSC application to a client's web browser. In order to host this bridge server on your local machine, make sure you have the following installed:

* Node.js and npm (you can find the download instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

Once npm is installed, you will need to navigate to the `aframe-audio-components/` folder and run the following commands:

```txt
npm install node-osc@6.0.2
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
### Running OSC Commands

Once you have set up the web client, bridge server, and OSC client, you should be able to send OSC commands from your OSC client to any connected browsers. A non-exauhstive list of OSC commands can be found [here](https://github.com/RCOS-Virtual-Music/aframe-audio-components/tree/documentation/documentation/osc-commands.md).

## Development

#### Integration

If you would like to figure out how to integrate new components into the audio components library, it is reccomended to look at the following guides and resources:

* [A non exauhstive list of valid OSC commands](https://github.com/RCOS-Virtual-Music/aframe-audio-components/tree/documentation/documentation/osc-commands.md) (Resource)
* [Adding an internal UI component](https://github.com/RCOS-Virtual-Music/aframe-audio-components/tree/documentation/documentation/adding-an-internal-ui-component.md) (Guide)

#### Compatibility

Most A-Frame components are compatible with the OSC interface out-of the box. However, to ensure that the interactions with the entity are easily understood, it is reccomended that your provide an Attributes table and a Methods table for all the public facing properties and methods you would like accessible, as shown below. 

##### Attribute table
| Attribute | Component Mapping | Default Value |
|--|--|--|
| descriptive-name-a | componentNameA.propertyNameA | 0 |
| descriptive-name-b | componentNameB.propertyNameB | "hello world" |

##### Method table
| Method | Description |
|--|--|
| methodA(arg1, arg2) | Description of method A |
| methodB() | Description of method B |

If you are making an individual component, it is still reccomended to make a table similar to the ones above. All of your schema variables should be recorded in the Attribute table and all of your public methods should be recorded in the Method table. 

## References and Resources
+ [Open Sound Control Web Bridge](https://github.com/automata/osc-web)
+ [aframe-ui-widgets npm package](https://www.npmjs.com/package/aframe-ui-widgets)
+ [Open Sound Control Web Bridge](https://github.com/automata/osc-web)
+ [Karrik By Jean-Baptiste Morizot + Lucas Le Bihan, Velvetyne Type Foundry ](https://velvetyne.fr/fonts/karrik/)
+ [Gulax Regular by Morgan Gilbert + contributions by Anton Moglia, Velvetyne Type Foundry](https://velvetyne.fr/fonts/gulax/)
+ [Disket Mono by designed by Mariano Diez. Cyrillic set, by Denis Ignatov.](https://rostype.com/disket/)