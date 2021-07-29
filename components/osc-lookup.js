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
        console.log('adds')
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
	_run: function(funct, c_name, args, id) {
		var entities = document.querySelectorAll(`[${c_name}]`);
		for (let i = 0; i < entities.length; ++i) {
			// Check the entity's id
			let e_id = AFRAME.utils.entity.getComponentProperty(entities[i], 'osc-receiver');

            if (id == -2) { /* No checks */ }
            else if (id === -1) { if (e_id == undefined) { continue; } }
            else if (e_id < 0 || id != e_id) { continue; }
            console.log(e_id)
			// If we found the id to be valid (strictly true), call the function
			funct.call(this, entities[i], ...args);
		}
	},
    runOSC: function(message) {
        if (message.length !== 2) { return; }
        let path = message[0].split('/');
        let arg = message[1];
        let cmd = path[path.length - 1];
        // Check if command path is invalid
        if (path.length < 3) { return; }
        // Check the root path name (component or a special operator) and pass off the call
        if (cmd === 'adds' || cmd === 'subs') {
            if (args.length === 5) { id = args[4]; args = args.slice(0, 4); }
            else if (args.length === 3) { args.push((path[2] === 'adds') ? 1 : 0); }
            if (args.length != 4) { return; }
            this._run.call(this, eval(`this._${path[2]}`), path[1], args, id);
        }
        else if (cmd === 'set' || cmd === 'add' || cmd === 'sub') {
            if (args.length == 4) { id = args[3]; args = args.slice(0, 3); }
            if (args.length != 3) { return; }
            this._run.call(this, eval(`this._${path[2]}`), path[1], args, id);
        }
    }
})
