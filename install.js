const exec = require('child_process').exec,
  fs = require('fs');

fs.readdir(__dirname + "/examples", (err, files) => {
  if (!err) {
    files.forEach(file => {
      if (fs.statSync(__dirname + "/examples/" + file).isDirectory()) {
        fs.stat(__dirname + "/examples/" + file + "/world.html", function(err, stat) {
            if(err == null) {
              console.log(`Installing "./examples/${file}/world.html"`);
              // Install scripts for the example worlds
              exec("npm --prefix ./examples/" + file + " install osc@2")
            }
        });
      }
    })
  }
})
