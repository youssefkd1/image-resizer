alert("soon drag and drop will be available NOTE:--------- images will be saved with webp extention to low size");

const fileInput = document.getElementById("fileInput");
const originalImg = document.querySelector(".original .preview-img");
const resizedImg = document.querySelector(".resized .preview-img");
let originalImageData = null;

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    originalImg.src = event.target.result;
    resizedImg.src = event.target.result;
    originalImageData = event.target.result;
    updateFileSize(file.size, "originalSize");
  };
  reader.readAsDataURL(file);
});


const resizeButton = document.querySelector(".btn-primary");
resizeButton.addEventListener("click", () => {
  if (!originalImageData) return;

  const img = new Image();
  img.src = originalImageData;
  img.onload = () => {
    const widthInput = document.getElementById("widthInput");
    const heightInput = document.getElementById("heightInput");
    const maintainAspect = document.getElementById("aspectRatio").checked;
    const percentage = document.getElementById("percentageRange").value;

    let newWidth = img.width * (percentage / 100);
    let newHeight = img.height * (percentage / 100);

    if (widthInput.value && heightInput.value) {
      newWidth = parseInt(widthInput.value);
      newHeight = maintainAspect
        ? (img.height / img.width) * newWidth
        : parseInt(heightInput.value);
    }

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const outputFormat = document.querySelector("select").value;
    const quality = document.querySelector('input[type="range"][max="100"]').value / 100;
    const dataUrl = canvas.toDataURL(`image/${outputFormat}`, quality);

    resizedImg.src = dataUrl;

    // Get image size in KB
    const byteString = atob(dataUrl.split(',')[1]);
    updateFileSize(byteString.length, "newSize");
  };
});



const downloadButton = document.querySelector(".btn-success");
downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = resizedImg.src;
  link.download = "youssef-firas"; // Can change based on selected format
  link.click();
});



document.querySelector(".btn-outline-secondary").addEventListener("click", () => {
    fileInput.value = '';
    originalImg.src = '';
    resizedImg.src = '';
    document.getElementById("widthInput").value = '';
    document.getElementById("heightInput").value = '';
    document.getElementById("percentageRange").value = 100;
    document.getElementById("percentageValue").innerText = "100%";
    document.getElementById("originalSize").innerText = "0 KB";
    document.getElementById("newSize").innerText = "0 KB";
  });
  


  function updateFileSize(sizeInBytes, elementId) {
    const sizeKB = (sizeInBytes / 1024).toFixed(2);
    document.getElementById(elementId).innerText = `${sizeKB} KB`;
  }
  