# Example Entities
These are the actual objects we will eventually port over to Mozilla Spokes. 

## speaker
Acts in accordance to whatever it\'s controller/manager tells it. Can outputs sounds, be moved around, and have animation changes.

#### Code
	// this is example code!

#### Dependencies
* VEM/audio-out
* VEM/animator
* VEM/riggings

#### Assets
* This is a bulleted list of any 3D assets the component has

## multi-speaker
Acts in accordance to whatever it\'s controller/manager tells it. Can outputs sounds, be moved around, and have animation changes. This speaker can be connected to multiple controllers/managers to have multiple audio sources playing at once. Only one controller/manager can control its animation and position.
#### Code
	// this is example code!

#### Dependencies
* VEM/audio-out
* VEM/animator
* VEM/riggings

#### Assets
* This is a bulleted list of any 3D assets the component has

## spotlight
Acts in accordance to whatever it\'s controller/manager tells it. Can be moved around, change light values, and have animation changes. This speaker can have multiple audio sources playing at once.
#### Code
	// this is example code!

#### Dependencies
* core/light
* VEM/animator
* VEM/riggings

#### Assets
* This is a bulleted list of any 3D assets the component has

## synthesizer
Acts as a controller/manager for other entities and itself. Takes in OSC commands from a given port and changes the scene accordingly. It can also outputs sounds, be moved around, and have animation changes.
#### Code
	// this is example code!

#### Dependencies
* VEM/audio-out
* VEM/rigging
* VEM/animator
* VEM/osc-input
* VEM/sound-maker

#### Assets
* This is a bulleted list of any 3D assets the component has



## soundboard
The soundboard entity is an in-world controller for all other VEM components, acting as an alternative for the osc-output component. This is a *very* abstract idea meant to be replaced with multiple more specific entities for controlling VEM commands. 

#### Code
	// this is the entity itself!

#### Dependencies
* VEM/vem-controller

#### Assets
* This is a bulleted list of any 3D assets the entity uses
