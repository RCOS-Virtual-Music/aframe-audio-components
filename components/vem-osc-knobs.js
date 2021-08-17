/*
    This component provides a boilerplate AFrame component for using A-Frame objects with VEM's OSC commands (to be used with the knobs.html scene).
    In this component, we use the npm package a-frame-ui-widgets as an UI connnected to VEM's osc-components.
 */
AFRAME.registerComponent("vem-osc-knobs", { // !! Rename
  dependencies: ["osc-lookup"],
  schema: {
    on: {
      // for UI controls
      type: "boolean",
      default: false,
    },

    isTargetEntity: {
      // denotes that a A-Frame object can be manipulated
      type: "boolean",
      default: false,
    },

    objectType: { // !! may need to denete
      // denotes either an UI control or an geometry (further specified)
      type: "string",
      default: "",
    },

    isUI: {
      // denotes if entity is an UI control
      type: "boolean",
      default: false,
    },

    oscReceiver: {
      type: "integer",
      default: -1, 

    }
  },

  // init: bind event listeners
  init: function () {
    var data = this.data; // Component property values.
    var el = this.el;  
    var isUI = data.isUI;
  /*  if (!isUI && el.hasAttribute("osc-receiver") { // binding click event for A-Frame geometries
      el.addEventListener("click", function () {
        //targetEntity = this.target;
        console.log("target entity clicked!");
        console.log("\nwhat is clicked: ", el.target.id);
        isTargetEntity = true;
          //targetEntity = event.target;
        if (document.querySelector("#target") != null) {  // if there's an existing target entity 
          document.getElementById("target").removeAttribute("id"); // removing target id from old target
        }
        el.target.id = "target";
      
      });
    }*/
  },

  update: function () {
    var data = this.data; // Component property values.
    var el = this.el; // Reference to the component's entity
    var targetEntity = document.getElementById('target'); // Stores query selector of object to be manipulated: should already have this?
    // console.log('target entity clicked!' + targetEntitity.el);
    // control flow: either an UI control, or an A-Frame object
    //UI control

    var isUI = data.isUI;

    function randomColor() {
      var randomHexColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
      return randomHexColor;
    }

    if (isUI) {
      // UI control
      // function for checking what UI type and setting osc_message
      function controlTypeOSCMessage() {
        var osc_message = "";
        controlType = el.id; 
        switch (controlType) {
          case "cubeControl": // id of UI control
            osc_message = ["/material/set", "color", newColor, 0]; // OSC message / action you want to send and the osc-receiver # of the object you want to send to
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

      el.addEventListener("click", () => {
        //var isOn = data.on;
        /*if (isOn) {
          console.log("i'm off!");
          isOn = false;
        } else {*/
          console.log("i'm now on!");
          osc_message = controlTypeOSCMessage();
          console.log(osc_message);
          this.el.components["osc-lookup"].runOSC(osc_message);
          isOn = true;
        //}
      });
    }
  },
});