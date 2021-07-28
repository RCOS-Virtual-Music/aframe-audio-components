// const { Message } = require("node-osc");
/*
    This component provides a boilerplate AFrame component for using A-Frame objects with VEM's OSC commands (to be used with the knobs.html scene).
    In this component, we use the npm package a-frame-ui-widgets as an UI connnected to VEM's osc-components.
 */
AFRAME.registerComponent("vem-osc-knobs", {
  dependencies: ["osc-lookup"],
  schema: {
    on: {
      // for UI controls
      type: "boolean",
      default: false,
    },

    isTargetEntity: {
      // for A-Frame object to be manipulated
      type: "boolean",
      default: false,
    },

    objectType: {
      // either an UI control or an geometry (further specified)
      type: "string",
      default: "",
    },

    isUI: {
      // if it's an UI control
      type: "boolean",
      default: false,
    },
  },

  // init: bind event listeners
  init: function () {
    var data = this.data; // Component property values.
    var el = this.el;
    el.addEventListener("click", function () {
      //  console.log("click");
      // console.log("\nwhat is clicked: ", event.target);
      //targetEntity = event.target;
      if (el.hasAttribute("osc-receiver")) {
        console.log("target entity clicked!");
        console.log("\nwhat is clicked: ", el.target.id);
        isTargetEntity = true;
        //targetEntity = event.target;
        if (document.querySelector("#target") != null) {
          // if there's an existing target entity
          document.getElementById("target").removeAttribute("id"); // removing target id from old target
        }
        el.target.id = "target";
      }
    });
  },

  update: function () {
    var data = this.data; // Component property values.
    var el = this.el; // Reference to the component's entity
    // var targetEntity = document.getElementById('target'); // Stores query selector of object to be manipulated: should already have this?
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
        controlType = el.id; // !! check if this  (querySelector) is right property - also change to id instead
        var newColor = randomColor();
        switch (controlType) {
          case "cubeControl": // id of UI control
            osc_message = ["/material/set", "color", newColor, 0];
            break;
          case "sphereControl": // !! ACTION
            osc_message = ["/material/set", "color", newColor, 1];
            break;
          /*case 'valueSlider': // needs value slider to be fixed before assigning an action
            osc_message = ['/position/set', 'x', 10, -1];
            break;
          */
          case "cylinderControl": // !! ACTION
            osc_message = ["/material/set", "color", newColor, 2];
            break;
          case "allControl": // !! ACTION
            osc_message = ["/material/set", "color", newColor, -1];
            break;
          /*case 'rotaryKnob': // needs rotary knob to be fixed before assigning an action
            osc_message = ['/position/set', 'x', 10, -1];
            break;
          */
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
/*tick: function () {},
        remove: function () {},
        pause: function () {}, // can integrate audio here
        play: function () {} // can iintegrate audio here
        */

/*Animates UI elements on actions and carries out OSC commands */
/*update: function () {
            var data = this.data;  // Component property values.
            var el = this.el;  // Reference to the component's entity.
            // check which UI element is clicked

            // Current OSC Commands:
            /*
            * /<component>/add <property> <value> [id=0]
            * /<component>/sub <property> <value> [id=0]
            * /<component>/set <property> <value> [id=0]
            * /<component>/adds <property> <value> [max=1] [id=0]
            * /<component>/subs <property> <value> [min=0] [id=0]``
            */
//osc_message: what you want to send
//syntax: [<command>, <property>, <value>, <id>]
/*Switch statement for assigning OSC Commands types to UI controls*/
/*var osc_message;
            controlType = el.querySelector(); // check if this  (querySelector) is right property
            switch (controlType) {
                case '#target':
                    action = 'action1';
                    osc_message = ['/position/set', 'x', 10, -1];
                    this.el.components['osc-lookup'].runOSC(osc_message); //!! check syntax for getting componnent name
                    break;
                case '#buttonCustom':
                    action = 'action1';
                    break;
                case '#buttonStd':
                    action = 'action1';
                    break;
                case '#valueSlider':
                    action = 'action1';
                    break;
                case'#toggleSwitch':
                    action = 'action1';
                    break;
                case '#rotaryKnob':
                    action = 'action1';
                    break;
            }
            
            let osc_message = ['/position/set', 'x', 10, -1];
            this.el.components['osc-lookup'].runOSC(osc_message); 
        }*/

// original in file script
/*
    var targetEntity = document.querySelector('#target');
  
      // picks random color buttonCustom
      var buttonCustom = document.querySelector('#buttonCustom');
      buttonCustom.addEventListener('pressed', function(e) {
        console.log("pressed!")
        var scene = document.querySelector('a-scene');
        if ( scene.getAttribute('stats') ) {
          scene.setAttribute('stats', 'false');
        } else {
          scene.setAttribute('stats', 'true');
        }
      });
  
      // picks random color buttonCustom
      var buttonStd = document.querySelector('#buttonStd');
      buttonStd.addEventListener('pressed', function() {
        console.log("pressed!")
        var randomHexColor = Math.floor(Math.random() * 0xffffff).toString(16);
        targetEntity.setAttribute('material', {
          color: '#' + randomHexColor
        });
      });
  
      // changes size: this one needs to be updates
      var valueSlider = document.querySelector('#valueSlider');
      valueSlider.addEventListener('pressed', function(e) {
        console.log("slider pressed!")
        targetEntity.setAttribute('geometry', { q: e.detail.value });
      });
  
      // animates object
      var toggleSwitch = document.querySelector('#toggleSwitch');
      var interval;
      toggleSwitch.addEventListener('change', function(e) {
        console.log("pressed!")
        if (e.detail.value) {
          interval = setInterval(function() {
            targetEntity.setAttribute('rotation', {
              y: targetEntity.getAttribute('rotation').y + 1
            })
          }, 10);
        } else {
          clearInterval(interval);
        }
      });
  
      // changes tubular radius
      var rotaryKnob = document.querySelector('#rotaryKnob');
      rotaryKnob.addEventListener('change', function(e) {
        console.log("pressed!")
        var value = e.detail.value * 0.01;
        targetEntity.setAttribute('geometry', {
          radiusTubular: targetEntity.getAttribute('geometry').radiusTubular + value
        });
      });
    */
