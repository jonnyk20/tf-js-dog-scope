const hide = el => (el.style.display = "none");
const show = el => (el.style.display = "initial");
const formatClassAndScore = (label, score) => `${label}: %${(score * 100).toFixed(2)}`

const filterDogs = detections =>
  detections.filter(detection => detection.class === "dog");

const preview = document.getElementById("preview");
const image = document.getElementById("image");
const upload = document.getElementById("upload");
const loadModelButton = document.getElementById("load");
const predictButton = document.getElementById("predict");
const spinner = document.getElementById("spinner");
const input = document.getElementById("file");
const preditionsContainer = document.getElementById("predictions");

let classificationModel;
let detectionModel;
let imageCanvas
let detections = [];

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

const loadModels = async () => {
  show(spinner);
  hide(loadModelButton);
  classificationModel = await mobilenet.load();
  detectionModel = await cocoSsd.load();
  hide(spinner);
  show(predictButton);
}

const renderCanvas = () => {
  const { width: imgW, height: imgH } = image
  imageCanvas = document.createElement('canvas');
  imageCanvas.width = imgW
  imageCanvas.height = imgH
  const ctx = imageCanvas.getContext('2d')
  ctx.drawImage(image, 0, 0, imgW, imgH)
  preview.appendChild(imageCanvas)
  hide(image)
}

const renderBoxes = () => {
  const ctx = imageCanvas.getContext('2d')
  detections.forEach(({  bbox, class: label, score }) => {
    const [boxX, boxY, boxW, boxH] = bbox;
    ctx.lineWidth = 2
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.rect(boxX, boxY, boxW, boxH)
  })
  ctx.stroke()
}

const classifyBox = async detection => {
  const { width: imgW, height: imgH } = image;
  const { height: imageCanvasH, width: imageCanvasW } = imageCanvas;
  const [boxX, boxY, boxW, boxH] = detection.bbox;
  const widthScale = imgW / imageCanvasW
  const heightScale = imgH / imageCanvasH

  const croppedCanvas = document.createElement('canvas')
  const A = boxX * widthScale// x
  const B = boxY * heightScale// y
  const C = imgW // w original
  const D = imgH // h original
  const E = 0
  const F = 0
  const G = imageCanvasW // w original (scale)
  const H = imageCanvasH // h original (scale)
  const ctx = croppedCanvas.getContext("2d")
  croppedCanvas.height = boxH // cropH
  croppedCanvas.width = boxW // cropW
  ctx.drawImage(image, A, B, C, D, E, F, G, H)
  const classfications = await classificationModel.classify(croppedCanvas)
  const { className, probability } = classfications[0];
  const label = formatClassAndScore(className, probability)
  return { ...detection, label }
}

const renderClassifications = detectedAndClassifiedObjects => {
  const ctx = imageCanvas.getContext('2d')
  detectedAndClassifiedObjects.forEach(({ label, bbox }) => {
    const [boxX, boxY] = bbox;
    ctx.fillText(label, boxX + 20, boxY + 20)
  })
  hide(spinner)
}

const detect = async () => {
  show(spinner);
  hide(predictButton);
  detections = filterDogs(await detectionModel.detect(image))
  renderCanvas()
  renderBoxes()
  const classifications = await Promise.all(detections.map(classifyBox))
  renderClassifications(classifications)
};

const renderPrecitions = predictions => {
  predictions.forEach(prediction => {
    el = document.createElement("li");
    el.innerText = prediction
    preditionsContainer.appendChild(el);
  });
};

input.onchange = handleUpload;
loadModelButton.onclick = loadModels;
predictButton.onclick = detect;
