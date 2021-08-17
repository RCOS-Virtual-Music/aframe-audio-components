/*
  This component provides the JavaScript functionality for an case study 
  using VEM's OSC A-Frame components to send OSC messages from an A-Frame scene (based
  on current properties of entities in the scene) back to
  client-side audio software on clicks to UI controls in an A-Frame Scene.
*/
AFRAME.registerComponent("osc-from-aframe-knobs", {
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

  // using to bind initial event listeners
  init: function () {
    var data = this.data; // Component property values
    var el = this.el;
    var isUI = data.isUI;
    var emitType = data.emitType;
    el.addEventListener("click", function () { // setting button/UI control on and off states
      if (isOn) {
        isOn = false;
        console.log("now off!")
      } else {
        isOn = true;
        console.log("now on!")
      }
    });
  },

  update: function () {
    var data = this.data; // Component property values
    var el = this.el; // Reference to the component's entity
    var isUI = data.isUI;
    var emitType = data.emitType;


    /* function gets osc-receiver number (from osc-receiver component) of the object*/
    function getOSCReceiverID(this) {
      return this.el.getAttribute("osc-receiver");
    }

    /* function to construct format tag (a string consisting of what data type the passed values are based on OSC v2 syntax) 
     * for osc message */
    function constructOSCTag(valueArray){
      var tag = ",";
      for (let i = 0; valueArray,length; i++) {
        let value = valueArray[i];
        switch(value) {
          case (typeof value == "string" ): // value is string
            tag += "s";
          case(typeof value == "number" && Number.isInteger(value)): // value is integer
            tag += "i";
          case(typeof value == "number" && !Number.isInteger(value)): // value is float
            tag += "f";
          break;
        }
      }
      return tag;
    }

     /*functon finds entity with OSC message and returns the OSC messsage back */
     function sendOSCMessage(component, address, tag, args) {
      var osc_message = component.el.components['osc-lookup'].parse(address, tag, args);
      component.el.components['osc-manager'].send(osc_message);
      console.log(osc_message)
    }

    function currPositionOSC(this) {
      // getting position
      var oscRecieverID = getOSCReceiverID(this);
      var positionObject = data.getAttribute('position');
      var currentX = Array(positionObject.getComponent(0)); // 0 returns x
      var currentY = Array(positionObject.getComponent(1)); // 1 returns y
      var currentZ = Array(positionObject.getComponent(2)); // 2 returns z

      // creating "tags" based on current values and sending OSC message to osc_lookup
      var x_tag = constructOSCTag(currentX);
      sendOSCMessage("/"+oscRecieverID+"/position/x/set", x_tag, currentX);  

      var y_tag = constructOSCTag(currentY);
      sendOSCMessage("/"+oscRecieverID+"/position/y/set", y_tag, currentY);

      var z_tag = constructOSCTag(currentZ);
      sendOSCMessage("/"+oscRecieverID+"/position/z/set", z_tag, currentZ);

    }

    function currHeightWidthOSC(this) {
      // getting height and width values
      var oscRecieverID = getOSCReceiverID(this);
      var currentHeight = Array(this.el.getAttribute("height"));
      var currentWidth = Array(this.el.getAttribute("width"));

      // creating "tags" based on current values and sending OSC message to osc_lookup
      var height_tag = constructOSCTag(currentHeight);
      sendOSCMessage("/"+oscRecieverID+"/geometry/set/height", height_tag, currentHeight); 
      var width_tag = constructOSCTag(currentWidth);
      sendOSCMessage("/"+oscRecieverID+"/geometry/set/width", width_tag, currentWidth); 
  
    }

    function currRotationOSC(this) {
      var oscRecieverID = getOSCReceiverID(this);
      // getting current rotation values
      var rotationObject = data.getAttribute('rotation'); // returned as Object3d Vector
      var currentX = Array(rotationObject["x"]); 
      var currentY = Array(rotationObject["y"]); 
      var currentZ = Array(rotationObject["z"]); 

      // creating "tags" based on current values and sending OSC message to osc_lookup
      var x_tag = constructOSCTag(currentX);
      sendOSCMessage("/"+oscRecieverID+"/rotation/x/set", x_tag, currentX);  

      var y_tag = constructOSCTag(currentY);
      sendOSCMessage("/"+oscRecieverID+"/rotation/x/set", y_tag, currentY);  

      var z_tag = constructOSCTag(currentZ);
      sendOSCMessage("/"+oscRecieverID+"/rotation/z/set", z_tag, currentZ);  
  
    }

    function currColorOSC(this) {
      // getting current color value
      var oscRecieverID = getOSCReceiverID(this);
      var currentColor = Array(el.getAttribute("color"));
      // creating "tags" based on current values and sending OSC message to osc_lookup
      var color_tag = constructOSCTag(currentColor);
      sendOSCMessage("/"+oscRecieverID+"/material/set/color", color_tag, currentColor); 

    }

    /* Control conditional for continuous versus single control UI*/
    var objectArray = this.el.sceneEl.querySelectorAll(".objectOSC");

    if (isUI && isOn && emitType == "continuous") { // continous button is on
      while (isOn) {
        for (var i = 0; i < objectArray.length; i++) {
          currPositionOSC(this);
          currHeightWidthOSC(this);
          currRotationOSC(this);
          currColorOSC(this);
        }
        
      }
     
    } else if (isUI && isOn && emitType == "singleUse") { //  regular button is on
      for (var i = 0; i < objectArray.length; i++) {
        currPositionOSC(this);
        currHeightWidthOSC(this);
        currRotationOSC(this);
        currColorOSC(this);
      }
    }
  }
});
