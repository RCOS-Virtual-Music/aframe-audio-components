# Components
These components are the code snippets that can be attached to entities for some actual effect.

##  vem-controller
A series of commands used to interact with objects in a scene.

*NOTE: On the backend, VEM commands are just function triggers for the components in the scene.*

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
|  |  |  |

#### Dependencies

#### VEM Commands
| Command | Reciever | Description |
--- | --- | --- 
glide(x, y, z, time, useRelative=false) | rigging | Moves all riggings to a space x, y, z (floats) over a certain period of time.
playNote(instrument, note, length)
playSequence(instrument, sequence)
playSong(url, fadeIn=0)
stopSong(url, fadeOut=0)

## osc-manager
Recieves OSC commands, parses them, and sends them to relevant objects in the scene. Maps OSC commands to VEM commands.
#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| serverIP |  | 127.0.0.1 |
| serverPort |  | 3333 |
| clientIP |  | 127.0.0.1 |
| clientPort |  | 3334 |
| outputID |  | 0 |

#### Dependencies
* VEM/vem-controller

#### OSC Commands

## input-manager
Maps various user-specifified (but prebuilt) inputs to VEM commands.
#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| outputID |  | 0 |

#### Dependencies
* VEM/vem-controller

#### OSC Commands


## rigging
Allows for an object\'s position to be moved based on VEM commands.

*NOTE: We should queue position changes instead of instantly changing them to allow for spamming of commands w/o some sort of odd motion and allow the user to know what the start and end states are. Should also allow you to 'rig' a entity to another entity and allow you to lock rotations/positions.*

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| queueChanges | Whether the position changes are queued or instantly overwrite the current motion | true |
| inputID |  | 0 |

#### Dependencies
* core/Animation


## animator
allows for models to be changed based on osc inputs. Controlled via VEM commands. Should queue model changes instead of instantly changing them to allow for spamming of commands w/o some sort of odd motion and allow the user to know what the start and end states are. 

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| queueChanges | Whether the animation changes are queued or instantly overwrite the current animation | true |
| inputID |  | 0 |

#### Dependencies
* core/Animations

## audio-stream
An output for localized sound in 3D space. Requires a connected manager to play sound. 
#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| inputID |  | 0 |

#### Dependencies
* core/sound ?

## particle-spawner
Spawns new particles into the world space

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| inputID |  | 0 |

#### Dependencies
* IdeaSpaceVR/aframe-particle-system-component

## spawner
Spawns new 3D models into the world space

#### Example
	// this is example code!

#### Value
| Property | Description | Default |
--- | --- | ---
| inputID |  | 0 |

#### Dependencies
