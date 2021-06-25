# At-A-Glance
| Component | Component Dependencies | Description |
--- | --- | ---
vem-controller | --- | A series of commands used to interact with objects in a scene. |
osc-manager | vem-controller | Recieves OSC commands, parses them, and sends them to relevant objects in the scene. Maps OSC commands to VEM commands. |
input-manager | vem-controller | Maps various user-specifified (but prebuilt) inputs to VEM commands. |
rigging | core/Animation | Allows for an object\'s position to be moved based on VEM commands.
animator | core/Animation | allows for models to be changed based on osc inputs. Controlled via VEM commands. Should queue model changes instead of instantly changing them to allow for spamming of commands w/o some sort of odd motion and allow the user to know what the start and end states are.
audio-stream | core/sound? | An output for localized sound in 3D space. Requires a connected manager to play sound. 
particle-spawner | IdeaSpaceVR/aframe-particle-system-component | Spawns new particles into the world space

| Entity | Component Dependencies | Description |
--- | --- | ---
| synthesizer | audio-out<br/> rigging<br/> animator<br/> osc-input<br/> sound-maker | Acts as a controller/manager for other entities and itself. Takes in OSC commands from a given port and changes the scene accordingly. It can also outputs sounds, be moved around, and have animation changes.
| spotlight | light<br/> animator<br/> rigging| Acts in accordance to whatever it\'s controller/manager tells it. Can be moved around, change light values, and have animation changes. This speaker can have multiple audio sources playing at once. |
| speaker | audio-out<br/> animator<br/> riggings | Acts in accordance to whatever it\'s controller/manager tells it. Can outputs sounds, be moved around, and have animation changes. |
| multi-speaker | audio-out<br/> animator<br/> riggings | Acts in accordance to whatever it\'s controller/manager tells it. Can outputs sounds, be moved around, and have animation changes. This speaker can be connected to multiple controllers/managers to have multiple audio sources playing at once. Only one controller/manager can control its animation and position. |
| soundboard | vem-controller | The soundboard entity is an in-world controller for all other VEM components, acting as an alternative for the osc-output component. This is a *very* abstract idea meant to be replaced with multiple more specific entities for controlling VEM commands. |
| spawner | --- | Spawns new 3D models into the world space. |