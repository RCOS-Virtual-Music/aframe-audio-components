/*
    This component provides a boilerplate AFrame component for using A-Frame objects with VEM's OSC commands
    In this component, we use the npm package a-frame-ui-widgets as an UI connnected to VEM's osc-components.
 */
AFRAME.registerComponent("osc-to-aframe-knobs", {
  // !! Rename
  dependencies: ["osc-lookup"],
  schema: {
    on: {
      // for UI controls
      type: "boolean",
      default: false,
    },

    isUI: {
      // denotes if entity is an UI control
      type: "boolean",
      default: false,
    },
  },

  update: function () {
    var data = this.data; // Component property values.
    var el = this.el; // Reference to the component's entity
    var isUI = data.isUI;

    function randomColor() {
      var randomHexColor = "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
      });
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
          case "sphereControl":
            osc_message = ["/material/set", "color", newColor, 1];
            break;
          case "cylinderControl":
            osc_message = ["/material/set", "color", newColor, 2];
            break;
          case "allControl":
            osc_message = ["/material/set", "color", newColor, -1];
            break;
        }
        return osc_message;
      }

      el.addEventListener("click", () => {
        var isOn = data.on;
        if (isOn) {
          console.log("i'm off!");
          isOn = false;
        } else {
          console.log("i'm now on!");
          osc_message = controlTypeOSCMessage();
          console.log(osc_message);
          this.el.components["osc-lookup"].runOSC(osc_message);
          isOn = true;
        }
      });
    }
  },
});
