const hide = el => (el.style.display = "none");
const show = el => (el.style.display = "initial");
const formatClassAndScore = (label, score) => `${label}: %${(score * 100).toFixed(2)}`

const preview = document.getElementById("preview");
const image = document.getElementById("image");
const upload = document.getElementById("upload");
const loadModelButton = document.getElementById("load");
const predictButton = document.getElementById("predict");
const spinner = document.getElementById("spinner");
const input = document.getElementById("file");
const preditionsContainer = document.getElementById("predictions");

let classificationModel;
let imageCanvas

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
  classificationModel = await mobilenet.load();
  hide(spinner);
  show(predictButton);
}

const classifyImage = async () => {
  show(spinner);
  hide(predictButton);
  const results = await classificationModel.classify(image)
  const formattedresults = results.map(({ className, probability }) => formatClassAndScore(className, probability));
  hide(spinner);
  show(preditionsContainer);
  renderClassifications(formattedresults)
}

const renderClassifications = predictions => {
  console.log('predictions', predictions)
  predictions.forEach(prediction => {
    el = document.createElement("li");
    el.innerText = prediction
    preditionsContainer.appendChild(el);
  });
};


input.onchange = handleUpload;
loadModelButton.onclick = loadModel;
predictButton.onclick = classifyImage;
