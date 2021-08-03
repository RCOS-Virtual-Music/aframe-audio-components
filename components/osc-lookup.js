AFRAME.registerComponent('osc-lookup', {
    init: function () {
        this.el.addEventListener('runOSC', this.runOSC);
    },
    _update: function(entity, component, property, value) {
        // NOTE: The current method is a workaround for an AFRAME bug where
        // setComponentProperty would not properly update position and rotation
        // components.
        entity.components[component].data[property] = value;
        entity.components[component].update(entity.components[component].oldData)
        //AFRAME.utils.entity.setComponentProperty(entity, `${component}.${property}`, value);
    },
    _set: function(entity, component, property, value) {
		// Make sure the component has the property
		if (entity.getAttribute(component)[property] == undefined) { return null; }
		// Set the property to the given value
    this._update(entity, component, property, value);
		return value;
	},
	_add: function(entity, component, property, value) {
		// Make sure the component has the property
		let current = entity.getAttribute(component)[property];
		if (current == undefined) { return null; }
		// Can only add numbers
		if (isNaN(current) || isNaN(value)) { return null; }
		// Set the property to the given value
		this._update(entity, component, property, value + current);
		return value + current;
	},
	_sub: function(entity, component, property, value) {
		// We can only negate numbers
		if (isNaN(value)) { return null; }
		// Add but with a negative value
		return this._add(entity, component, property, -value);
	},
	_subs: function(entity, component, property, value, min) {
		// Capture the new value in the property
		let new_value = this._sub(entity, component, property, value);
		// Return if it was not updated
		if (new_value == null) { return new_value; }
		// Make sure that the new value is not less than min
		if (new_value < min) {
			this._update(entity, component, property, min);
			return 0;
		}
		return new_value;
	},
	_adds: function(entity, component, property, value, max) {
		// Capture the new value in the property
		let new_value = this._add(entity, component, property, value);
		// Return if it was not updated
		if (new_value == null) { return new_value; }
		// Make sure that the new value is not more than max
		if (new_value > max) {
			this._update(entity, component, property, max);
			return max;
		}
		return new_value;
	},
  // Takes in the function to run, the argument array, and the id to target
	_run: function(funct, args, id) {
		var entities = document.querySelectorAll(`[${args[0]}]`);
		for (let i = 0; i < entities.length; ++i) {
			// Check the entity's id
			let e_id = AFRAME.utils.entity.getComponentProperty(entities[i], 'osc-receiver');
      if (id === "*") { if (e_id == undefined) { continue; } }
      else if (id != e_id) { continue; }
			// If we found the id to be valid (strictly true), call the function
			funct.call(this, entities[i], ...args);
		}
	},
  runOSC: function(oscMsg) {
    // Break up the address
    let address = oscMsg.address.split("/");
    if (address.length !== 5) { return; }
    // Create the arguments in the form [component, schema, *kwargs]
    let args = [address[2], address[3]];
    oscMsg.args.forEach((arg) => {
      args.push(arg.value)
    });
    // Get the command and id
    let cmd = address[4];
    let id = address[1];
    // Pass it off to the call based on the cmd name
    // Here we also add defeult args and do arg length checks
    if (false /*cmd === 'adds' || cmd === 'subs'*/) {
      if (args.length === 3) { args.push((cmd === 'adds') ? 1 : 0); }
      if (args.length !== 4) { return; }
      this._run.call(this, eval(`this._${cmd}`), args, id);
    }
    else if (cmd === 'set' /*|| cmd === 'add' || cmd === 'sub'*/) {
      if (args.length !== 3) { return; }
      this._run.call(this, eval(`this._${cmd}`), args, id);
    }
  }
})
