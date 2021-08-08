AFRAME.registerComponent('osc-receiver', {
    schema: {
        line: { type: 'int', default: 0 }
    },
    update: function () {
      var data = this.data;  // Component property values.
      var el = this.el;  // Reference to the component's entity.
      console.log("data")
      if (data.event) {
        // This will log the `message` when the entity emits the `event`.
        el.addEventListener(data.event, function () {
          console.log(data.message);
        });
      } else {
        // `event` not specified, just log the message.
        console.log(data.message);
      }
    }
})
