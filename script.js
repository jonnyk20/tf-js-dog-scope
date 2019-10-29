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

const fakeRequest = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(["cat", "dog"]), 1000);
  });

const handleUpload = event => {
  const { files } = event.target;
  if (files.length > 0) {
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    image.src = imageUrl;
    hide(upload);
    show(image);
    show(loadModelButton);
  }
};

const loadModel = async () => {
  show(spinner);
  hide(loadModelButton);
  model = await fakeRequest();
  hide(spinner);
  show(predictButton);
};

const makePrecitions = async () => {
  show(spinner);
  hide(predictButton);
  const predictions = await fakeRequest();
  hide(spinner);
  show(preditionsContainer);
  renderPrecitions(predictions);
};

const renderPrecitions = predictions => {
  predictions.forEach(prediction => {
    el = document.createElement("li");
    el.innerText = prediction;
    preditionsContainer.appendChild(el);
  });
};

input.onchange = handleUpload;
loadModelButton.onclick = loadModel;
predictButton.onclick = makePrecitions;
