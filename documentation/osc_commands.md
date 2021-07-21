# OSC Commands


## Common OSC Commands
These are some examples of common OSC commands you are likely to use.

| OSC Command | Description |
|--|--|
| `/position/add x 1` | Adds 1 to the x position of all entities with an id of 1  |
| `/position/sub y 1 1` | Subtracts 1 from the x position of all entities with an id of 1  |
| `/position/add z 1 2` | Adds 1 to the x position of all entities with an id of 2  |
| `/position/setf "0 0 0" 0` | Sets the position of all entities that have an id |
| `/rotation/add x` | Adds 1 to the position of all entities with an id of 1 |
| `/rotation/add y 1` | Adds 1 to the position of all entities with an id of 1 |
| `/rotation/add z 0` | Adds 1 to the position of all entities |
| `/rotation/setf "0 45 0" -1` | Sets the rotation of all entities that do no have an id of 1 to (0, 45, 0) |
| `/material/set color #FFFFFF` | Sets the color to white for all entities with an id of 1 |
| `/geometry/subs width 0.1` | Removes 0.1 from the current width of all entities with an id of 1, to a minimum of 0 |
| `/geometry/subs height 0.1 0.5` | Removes 0.1 from the current height of all entities with an id of 1, to a minimum of 0.5 |
| `/geometry/subs radius 0.1 0.2 0` | Removes 0.1 from the current radius of all entities with an id, to a minimum of 0.2 |
| `/geometry/adds arc 0.1 10` | Adds 0.1 to the arc angle to all entities with an id of 1 |
| `/osc-receiver/set id 4 2` | Changes the id of all entities with an id of 2 to 4 |

## OSC Command Templates
While knowing the most common OSC commands is useful, it is also useful to know how those commands were derived. In the tables below, `<variable-name>` represents a required variable and `[variable-name]` represents a optional variable.

| OSC Command | Description |
|--|--|
| `/<component>/set <property> <value> [id]` | Sets the property of a component to the given value |
| `/<component>/add <property> <value> [id]` | Adds the given value to the current value of the property |
| `/<component>/sub <property> <value> [id]` | Subtracts the given value to the current value of the property |
| `/<component>/setf <property> <value> [id]` | Sets the full property of a component to the given value. Usually only used for single property components that impliment a vector like rotation or position |
| `/<component>/adds <property> <value> [id]` | Adds the given value to the current value of the property without exceding the given maximum |
| `/<component>/subs <property> <value> [id]` | Subtracts the given value to the current value of the property without falling below the given minimum |
| `/<component>/call <method> [args..] [id]` | Calls the provided method of an entity with any provided arguments |

| Argument | Default Value | Description |
|--|--|--|
| `<component>` | N/A | The name of the component to modify. This can usually be found in an entity's [Attributes table](https://aframe.io/docs/1.2.0/primitives/a-sphere.html#attributes) under the Component Mapping column in the form `<component>.<property>` |
| `<property>` | N/A | The name of the property of a component to modify. This can usually be found in an entity's [Attributes table](https://aframe.io/docs/1.2.0/primitives/a-sphere.html#attributes) under the Component Mapping column in the form `<component>.<property>` |
| `<value>` | N/A | The value to set or modify a property by. If the command is "add", "subs", "adds", or "subs", this value must be a number. If the command is "set", it can be either a number or string. If the command is "setf", this value must be a single string representing a list of values seperated by spaces |
| `<method>` | N/A | The method of an entity to trigger. This can usually be found in an entity's [Methods list](https://aframe.io/docs/1.2.0/core/entity.html#methods) or a Methods table |
| `[id]` | 1 | The target id for entities in a scene that the OSC command will effect. If the target id is 0, the command will effect all entities that have a target id in the scene. If the target id is less than 0, the command will effect all entities in a scene with an id that does not match the absolute value of the target id. |
| `[args..]` | [ ] | The arguments of the function to call. If any arguments are provided, you must also provide a target id |
| `[max]` | 1 | The maximum numerical value the target property can be set to |
| `[min]` | 0 | The minimum numerical value the target property can be set to |

## Notes

* OSC commands are case sensitive
* OSC commands will only effect entities that have the property you are targeting. For example, `/geometry/subs radius 0.1 0.2 0` will have no effect on any <a-box\> primative entities.
