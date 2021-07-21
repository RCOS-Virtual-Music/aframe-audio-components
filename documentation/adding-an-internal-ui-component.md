# Adding an Internal UI Component to the Audio Library

This guide will walk you through how to add an A-Frame component to the existing audio library and ensure it is connected and compatible with the existing OSC communication components. By the end of this guide, your A-Frame component will have access to the same functionality described in the [list of OSC commands](https://github.com/RCOS-Virtual-Music/aframe-audio-components/tree/documentation/documentation/osc-commands.md).

### Dependencies

To ensure your component has access to the full capabilities of the OSC commands, it must be dependent on the osc-lookup component. To achieve this, add the following line into your existing component:

```js
AFRAME.registerComponent('my-component', {
	dependencies: ['osc-lookup'],
	schema: { /* my schema */ }, 
	init: function() { /* my init */ }
})
```

### Using the osc-lookup Component

In order to use the OSC component's functionality, you need to provide the component with a 'fake' OSC command. To translate an OSC command into the proper format, simply split the normal OSC command using spaces as a deliminator. Note that any OSC commands which have values surrounded in quotes should *not* be split in this mannar. A few examples are shown below.

```js
/position/add x 1 => ["/position/add", "x", 1]
/material/set color #FFFFFF -1 => ["/material/set", "color", "#FFFFFF", -1]
/geometry/subs radius 0.1 0.2 0 => ["/geometry/subs", "radius", 0.1, 0.2, 0]
/position/setf "0 0 0" 0 => ["/position/setf", "0 0 0", 0]
```

Once you have your modified OSC command, you can send it to the osc-lookup component for processing. To do so, run the following code:

```js
let message = ["/geometry/subs", "arc", 0.1, 0.25, -1];
this.el.components['osc-lookup'].runOSC(message);
```