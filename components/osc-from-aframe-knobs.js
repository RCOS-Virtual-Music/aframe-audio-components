/*
  This component provides the JavaScript functionality for an case study 
  using VEM's OSC A-Frame components to send OSC from an A-Frame scene back to
  Max8/simiilar audio software on clicks to items in an A-Frame Scene.
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
      // continous (auto checks and sends back OSC message) or single use
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
  /*let osc_message = component.el.components['osc-lookup'].parse('/3/rotation/x/info', ',f', [12.1]);
          component.el.components['osc-manager'].send(osc_message); */
  update: function () {
    var data = this.data; // Component property values
    var el = this.el; // Reference to the component's entity
    var isUI = data.isUI;
    var isOn = data.isOn;
    var emitType = data.emitType;

    /*functon finds entity with OSC message and returns the OSC messsage back */
    function controlTypeOSCMessage() {
      var osc_message = "";
      controlType = el.id; 
      switch (controlType) {
        case "cubeControl": // id of UI control
          osc_message = ["/material/set", "color", newColor, 0];
          break;
        case "sphereControl": // !! ACTION
          osc_message = ["/material/set", "color", newColor, 1];
          break;
        case "cylinderControl": // !! ACTION
          osc_message = ["/material/set", "color", newColor, 2];
          break;
        case "allControl": // !! ACTION
          osc_message = ["/material/set", "color", newColor, -1];
          break;
      }
      return osc_message;
    }
    /*Sending back OSC */
    if (isUI && isOn && emitType == "cont") { // continous button is on
      /* let oscMsg = component.el.components['osc-lookup'].parse('/3/rotation/x/info', ',f', [12.1]);
      component.el.components['osc-manager'].send(oscMsg);*/
      while (isOn) {
        osc_message = controlTypeOSCMessage();
      }
      return osc_message;
    } else if (isUI && isOn && emitType == "once") { //  regular button is on
      osc_message = controlTypeOSCMessage();
      component.el.components['osc-manager'].send(osc_message);
    }
  },
});
