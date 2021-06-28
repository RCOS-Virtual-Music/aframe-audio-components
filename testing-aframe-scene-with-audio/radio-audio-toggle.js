/*
    This component plays/pauses the audio (presumabley from an radio model in the A-Frame scene) when the radio is clicked. 
 */

AFRAME.registerComponent('radio-audio-toggle', {
    schema: {
        playing: {
            type: 'boolean',
            default: false
        }
      
    },
    
    update: function () {
        var data = this.data;  // Component property values.
        var el = this.el;  // Reference to the component's entity.
        var playing = data.playing;
        
        if (playing) {
            el.components.sound.playSound();
        } 

        el.addEventListener('click', () => {
            if (playing) {
              el.components.sound.pauseSound();
              playing = false;
            } else {
              el.components.sound.playSound();
              playing = true;
            }
        })
      }

  });