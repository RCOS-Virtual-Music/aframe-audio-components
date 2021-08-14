/*
  This component provides the JavaScript functionality for an case study 
  using VEM's OSC A-Frame components to send OSC from an A-Frame scene back to
  Max8/similar audio software on clicks to items in an A-Frame Scene.
*/
AFRAME.registerComponent("knobs-osc-from-aframe", {
  dependencies: ["osc-lookup"],
  schema: {

    isUI: {
      // denotes if entity is an UI control
      type: "boolean",
      default: false,
    },
    isOn: {
      // denotes if button/control has been clicked
      type: "boolean",
      default: false,
    },
    emitType: {
      // continous (auto checks and sends back OSC message) or singleUse
      type: "string",
      default: "",
    }
  },

  // init: initial event listeners
  init: function () {
    var data = this.data; // Component property values
    var el = this.el;
    var isUI = data.isUI;
    var emitType = data.emitType;
    el.addEventListener("click", function () { // setting button/UI control onn and off
      if (isOn) {
        isOn = false;
      } else {
        isOn = true;
      }
    });
  },

  update: function () {
    var data = this.data; // Component property values
    var el = this.el; // Reference to the component's entity
    var isUI = data.isUI;
    var isOn = data.isOn;
    var emitType = data.emitType;

    /*function gets osc-receiver number (from osc-receiver component) of the object*/
    function getOSCReceiverID(this) {
      return this.el.getAttribute("osc-receiver");
    }

    function currPositionOSC(this) {
      // getting position
      var oscRecieverID = getOSCReceiverID(this);
      var positionObject = data.getAttribute('position');
      var currentX = parseFloat(positionObject.getComponent(0)); // 0 returns x
      var currentY = parseFloat(positionObject.getComponent(1)); // 1 returns y
      var currentZ = parseFloat(positionObject.getComponent(2)); // 2 returns z

      // need to clean up string concatenation depending on method
      var osc_message = ["/"+oscRecieverID+"/rotation"+"/x"+"/set",  "["+currentX]+"]";  // TODO: check syntax, clean up string concat
      sendOSCMessage(osc_message);
      osc_message = ["/"+oscRecieverID+"/rotation"+"/x"+"/set",  "["+currentY+"]"];
      sendOSCMessage(osc_message);
      osc_message = [oscRecieverID, "/position", "/z", "/set", currentZ+"]"];
      sendOSCMessage(osc_message);

    }
    /*TODO: Function to construct array for osc message*/


    function currHeightWidthOSC(this) {
      // getting Height Width values
      var oscRecieverID = getOSCReceiverID(this);
      var currentHeight = parseFloat(this.el.getAttribute("height"));
      var osc_message = ["/"+oscRecieverID+"/geometry/set ", "height ", "["+currentHeight+"]"]; 
      sendOSCMessage(this, osc_message);

      var currentWidth = parseFloat(this.el.getAttribute("width"));
      osc_message = ["/"+oscRecieverID+"/geometry/set ", "width ", "["+currentWidth+"]"]; // TODO: check syntax, clean up string concat
      sendOSCMessage(this, osc_message);
  
    }

    function currRotationOSC(this) {
      var oscRecieverID = getOSCReceiverID(this);
      // getting rotation values
      var rotationObject = data.getAttribute('rotation'); // returned as Object3d Vector
      var currentX = parseFloat(rotationObject["x"]); 
      var currentY = parseFloat(rotationObject["y"]); 
      var currentZ = parseFloat(rotationObject["z"]); 

      // creating and sending array for OSC message to be sent
      var osc_message = ["/"+oscRecieverID+"/rotation"+"/x"+"/set", ".f", "["+currentX+"]"]; // TODO: check syntax, clean up string concat
      sendOSCMessage(this, osc_message);
      osc_message = ["/"+oscRecieverID+"/rotation"+"/y"+"/set", ".f",  "["+currentY+"]"];
      sendOSCMessage(this, osc_message);
      osc_message = ["/"+oscRecieverID+"/rotation"+"/z"+"/set", ".f", "["+currentZ+"]"];
      sendOSCMessage(this, osc_message);
  
    }

    function currColorOSC(this) {
      // getting color value
      var oscRecieverID = getOSCReceiverID(this);
      var currentColor = el.getAttribute("color");
      var osc_message = ["/"+oscRecieverID+"/material/set ",  "color", "["+currentColor+"]"]; // TODO: check syntax, clean up string concat

    }

    /*functon finds entity with OSC message and returns the OSC messsage back */
    function sendOSCMessage(component, oscMessageArray) {
      let osc_message = component.el.components['osc-lookup'].parse(oscMessageArray);
      component.el.components['osc-manager'].send(osc_message);
    }
    
    /* Control conditonal for continuous versus single control UI*/
    if (isUI && isOn && emitType == "continuous") { // continous button is on
    
      while (isOn) {
        currPositionOSC(this);
        currHeightWidthOSC(this);
        currRotationOSC(this);
        currColorOSC(this);
      }
     
    } else if (isUI && isOn && emitType == "singleUse") { //  regular button is on
        currPositionOSC(this);
        currHeightWidthOSC(this);
        currRotationOSC(this);
        currColorOSC(this);
    }
  }
});
