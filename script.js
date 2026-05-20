const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const preview = document.getElementById("preview");

selectBtn.onclick = () => fileInput.click();

fileInput.addEventListener("change", handleFiles);

["dragenter","dragover"].forEach(eventName=>{
dropArea.addEventListener(eventName,e=>{
e.preventDefault();
dropArea.classList.add("hover");
});
});

["dragleave","drop"].forEach(eventName=>{
dropArea.addEventListener(eventName,e=>{
e.preventDefault();
dropArea.classList.remove("hover");
});
});

dropArea.addEventListener("drop",e=>{
const files = e.dataTransfer.files;
handleFiles({target:{files}});
});

function handleFiles(e){
const files = e.target.files;

for(let file of files){

if(!file.type.startsWith("image/")) continue;

const img = document.createElement("img");
img.classList.add("preview-img");

img.src = URL.createObjectURL(file);

preview.appendChild(img);
}
}