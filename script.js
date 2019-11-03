const hide = el => (el.style.display = "none");
const show = el => (el.style.display = "initial");

const image = document.getElementById("image");
const upload = document.getElementById("upload");
const loadModelButton = document.getElementById("load");
const predictButton = document.getElementById("predict");
const spinner = document.getElementById("spinner");
const input = document.getElementById("file");
const preditionsContainer = document.getElementById("predictions");

let model;

const handleUpload = event => {
  const { files } = event.target;
  if (files.length > 0) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    image.src = imageUrl;
    hide(upload);
    show(image);
    show(loadModelButton);
  }
};

const loadModel = async () => {
  show(spinner);
  hide(loadModelButton);
  model = await mobilenet.load();
  hide(spinner);
  show(predictButton);
};

const makePrecitions = async () => {
  show(spinner);
  hide(predictButton);
  let predictions = await model.classify(image)
  if (predictions.length === 0) {
    predictions.push({ className: 'unknown '})
  }
  hide(spinner);
  show(preditionsContainer);
  renderPrecitions(predictions);
};

const renderPrecitions = predictions => {
  predictions.forEach(prediction => {
    console.log('PRED', prediction)
    el = document.createElement("li");
    el.innerText = prediction.className;
    preditionsContainer.appendChild(el);
  });
};


input.onchange = handleUpload;
loadModelButton.onclick = loadModel;
predictButton.onclick = makePrecitions;
