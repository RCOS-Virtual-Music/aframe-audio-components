# Components
These components are the code snippets that can be attached to entities for some actual effect.

##  vem-controller
A dictionary of commands used to interact with objects in a scene. The VEM controller also sends the manager's id with each call. VEM controllers require a parent with the "id" variable. 

*NOTE: On the backend, VEM commands are just function triggers for the components in the scene.*

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
|  |  |  |

#### Dependencies

#### VEM Commands
| Command                              | Arguments                                                    | Description                                                  |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| glide(x, y, z, time, relative)       | __x (float)__ x-position in 3D space to glide to<br/>__y (float)__ y-position in 3D space to glide to<br/>__z (float)__ y-position in 3D space to glide to<br/>__time (int)__ time in ms that the object will be in motion<br/>__mode (int)__ how the 3D target position is treated | Mode can be either 0 (global coordinates),1 (coordinates relative to the manager), or 2 (coordinates relative to the object). Calls {insert command here} in all riggings with a matching id. |
| modify(...)                          |                                                              |                                                              |
| sound(frequency, duration)           | __frequency (int)__ frequency of the note to play<br/>__duration (int)__ the amount of time in ms that the note should play | Plays a single note for a specified duration. Valid instruments are {insert valid instruments here}. Calls {insert command here} in all sound-makers with a matching id (including this one). |
| melody(frequencies, durations)       | __melody (string)__ a comma deliminated sequence of note frequencies<br/>__instrument (string)__ a comma deliminated sequence of of note durations | Calls {insert command here} in all sound-makers with a matching id (including this one). |
| note(key, duration, instrument)      |                                                              |                                                              |
| melody(notes, durations, instrument) |                                                              |                                                              |
| play(url, in, out)                   | __url (string)__ a url pointing to a valid audio file<br/>__in (int)__ the amount of time in ms that the audio should fade in<br/>__out (int)__ the amount of time in ms that the audio should fade in | Calls {insert command here} in all sound-makers with a matching id (including this one). |


## osc-manager
Recieves OSC commands, parses them, and sends them to relevant objects in the scene. Maps OSC commands to VEM commands.
#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | --- | --- | --- 
| serverIP |  | 127.0.0.1 |
| serverPort |  | 3333 |
| clientIP |  | 127.0.0.1 |
| clientPort |  | 3334 |
| id |  | 0 |

#### Dependencies
* VEM/vem-controller

#### OSC Commands

| OSC Command                              | Arguments | VEM Command                         |
| ---------------------------------------- | --------- | ----------------------------------- |
| /spawn/particle/\<name>                  | ,fff      |                                     |
| /spawn/object/\<name>                    | ,fff      |                                     |
| /animation/transition                    | ,s        |                                     |
| /rigging/glide                           | ,fffii    | glide(x, y, z, time, relative)      |
| /synthesizer/frequency                   | ,fi       | sound(frequency, duration)          |
| /synthesizer/frequency/sequence          | ,ss       | ssound(frequencies, durations)      |
| /synthesizer/play                        | ,sii      | play(url, in, out)                  |
| /synthesizer/note/\<instrument>          | ,si       | note(instrument, key, duration)     |
| /synthesizer/note/\<instrument>/sequence | ,sss      | melody(instrument, keys, durations) |

## input-manager
Maps various user-specified (but prebuilt) inputs to VEM commands.
#### Example
	// this is example code!

#### Value
 Property | Description | Default 
 --- | --- | --- 
 id |  | 0 

#### Dependencies
* VEM/vem-controller


## rigging
Allows for an object\'s position to be moved based on VEM commands.

*NOTE: We should queue position changes instead of instantly changing them to allow for spamming of commands w/o some sort of odd motion and allow the user to know what the start and end states are. Should also allow you to 'rig' a entity to another entity and allow you to lock rotations/positions.*

#### Example
	// this is example code!

#### Value
 Property | Description | Default 
 --- | --- | --- 
 queueChanges | Whether the position changes are queued or instantly overwrite the current motion | true 
 id |  | 0 

#### Dependencies
* core/Animation


## animator
allows for models to be changed based on osc inputs. Controlled via VEM commands. Should queue model changes instead of instantly changing them to allow for spamming of commands w/o some sort of odd motion and allow the user to know what the start and end states are. 

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | --- | --- | --- 
| queueChanges | Whether the animation changes are queued or instantly overwrite the current animation | true |
| id |  | 0 |

#### Dependencies
* core/Animations

## audio-stream
An output for localized sound in 3D space. Requires a connected manager to play sound. 

*NOTE: this would require Three.js to be able to play a sound in multiple locations at once, which might not be possible. An alternative would be to replace audio-stream with a sound-maker component.*

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | --- | --- | --- 
| id |  | 0 |

#### Dependencies
* core/sound ?

## particle-spawner
Spawns new particles into the world space

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | --- | --- | --- 
| id |  | 0 |

#### Dependencies
* IdeaSpaceVR/aframe-particle-system-component

## spawner
Spawns new 3D models into the world space

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | --- | --- | --- 
| id |  | 0 |

#### Dependencies

## osc-from-aframe-knobs
Sends entity values as OSC messages to machine and client side music software upon clicks to other
UI controls (called "knobs" here) in the scene.

#### Example
Add these as HTML-style attributes to your A-Frame scene's HTML file.

	// for entities for which you want their property values to be sent as OSC messages:
	osc-from-aframe-knobs= "isUI: false"></a-entity>
	
	// for UI controls: continuously send OSC after click
	osc-from-aframe-knobs= "isUI: true; isOn: false; emitType: continuous" 
	
	// for UI controls: send OSC once upon click
	osc-from-aframe-knobs= "isUI: true; isOn: false; emitType: singleUse" 
	
## osc-to-aframe-knobs
Sends OSC messages that update entity property values upon clicks to UI controls in the scene.

#### Example
Add these as HTML-style attributes to your A-Frame scene's HTML file.

	// for entities to which you want their property values to be updated from OSC messages:
	osc-to-aframe-knobs="on: false; isUI: false"
	
	// for UI controls: add an id descrbing which entity/entiities it controls (can change in the osc-to-aframe-knobs.js component file) 
	osc-to-aframe-knobs="on: false; isUI: true"
        id="cubeControl"

