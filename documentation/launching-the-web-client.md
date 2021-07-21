#### Launching the Web Client (Python)

To get started, make sure you have the following installed: <br/>

* Python 3.0 (you can download it [here](www.python.org/downloads/))

Using your terminal, navigate to the `aframe-audio-components/` directory. To launch the web client, simply run `python -m http.server 8000`. This launches the server on your localhost on port 8000 (default). Open [http://localhost:8000/](http://localhost:8000/) on any browser of your choosing and you should see the boilerplate scene. 

#### Launching the Web Client (npm live-server)
To get started, make sure you have the following installed:
 <br/>

* Node, npm (follow instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

1. In your terminal, cd into directory of the HTML file for the A-Frame scene: the  `aframe-audio-components/` directory.
2. In the terminal, run `npm install -g live-server && live-server`
3. A browser window should automatically be launched with the server. Otherwise, navigate to the server address outputted in the terminal.

In the future, now that live-server has been installed, you should be able to run `live-server` in the same directory as the HTML file in your terminal to launch the scene.

#### Launching the Web Client (VS Code Live Server)
Live Server is a VS Code extension that allows you to launch a local development Server with live reload feature for static & dynamic pages.
These instructions are for starting and running a server *if* you have a HTML file for your project. 

For serverside code such as `PHP`, `.NET` or `NodeJS` files, you will need to host your own server and additionally download the Live Server browser extension following [these instructions]():

1. Install [VS Code, a text editor from Microsoft](https://code.visualstudio.com/download). <sup>(code editor)</sup>
2. Install the VS Code extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). <sup>(extension to code editor)</sup>
3. Open up a project in VS Code.
4. At the bottom right handside of the status bar, there should be a button to `Go Live.` Click to turn this server on/off.
5. Right click on a `HTML` file from the Explorer window and click on `Open with Live Server.`

This should automatically open up the scene in a browser window.