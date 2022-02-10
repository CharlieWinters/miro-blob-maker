const {board} = window.miro;

let edges = 5;
let colour = '2196F3';
let opacity = 100;
let seed = 1234;

/** Initialises UI with first SVG blob */
async function init() {
  console.log('initialising module');

  const svgBlob = document.getElementById('svg-blob');

  const blobSeed = await fetch('/create-blob?edges=5')
      .then((response) => response.text());

  console.log(blobSeed);

  svgBlob.src = `/blob?seed=${blobSeed}`;

  await board.ui.on('drop', async ({x, y, target}) => {
    try {
      await board.createImage({
        x,
        y,
        url: target.src,
      });
    } catch (error) {
      console.log(error);
      console.log(
          `Drag and drop svgs do not work served from localhost 127.0.0.1, \
          please deploy app.`,
      );
    }
  });

  const sliderComplexity = document.getElementById('complexity');
  const sliderOpacity = document.getElementById('opacity');
  const regenerateButton = document.getElementById('regenerate');
  const colorPicker = document.getElementById('colorPicker');

  sliderComplexity.oninput = function() {
    edges = this.value;
    fetch(`/create-blob?edges=${edges}`)
        .then((response) => response.text())
        .then((data) => {
          seed = data;
          svgBlob.src = `
            /blob?seed=${seed}
            &edges=${edges}
            &colour=${colour}
            &opacity=${opacity}
          `;
        });
  };

  sliderOpacity.oninput = function() {
    opacity = this.value;
    svgBlob.src = `
      /blob?seed=${seed}
      &edges=${edges}
      &colour=${colour}
      &opacity=${opacity}
    `;
  };

  colorPicker.addEventListener('change', watchColorPicker, false);
  regenerateButton.addEventListener('click', regenerateBlob, false);

  /**
   * Watches for colour picker changes and parses to url.
   * @param {string} event - Colour string #xxxxx returned for colour picker.
   */
  function watchColorPicker(event) {
    // colour hash doesn't play well in urls so stripping hash
    colour = event.target.value.split('#')[1];
    svgBlob.src = `
      /blob?seed=${seed}
      &edges=${edges}
      &colour=${colour}
      &opacity=${opacity}
    `;
  }

  /** Regenerates blob with defined edges */
  function regenerateBlob() {
    fetch(`/create-blob?edges=${edges}`)
        .then((response) => response.text())
        .then((data) => {
          seed = data;
          svgBlob.src = `
            /blob?seed=${seed}
            &edges=${edges}
            &colour=${colour}
            &opacity=${opacity}
          `;
        });
  }
}

init();
