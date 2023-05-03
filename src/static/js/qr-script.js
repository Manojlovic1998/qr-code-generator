const qrForm = document.getElementById("qr-form");
const imgWrapper = document.getElementById("imgWrapper");
const imgNode = document.getElementById("qr-code");
const spinner = document.getElementById("spinner");
const downloadBtn = document.getElementById("download-btn");
const radioButtons = document.getElementsByClassName("btn-check");
const textInputNode = document.getElementById("qrInputValue");
const errorMessage = document.getElementById("error-message");

qrForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValue = textInputNode.value;
  if (inputValue.trim() === "") {
    // Form Control
    textInputNode.classList.toggle("is-invalid", true);
    errorMessage.classList.toggle("d-none", false);
    return;
  }
  textInputNode.classList.toggle("is-invalid", false);
  errorMessage.classList.toggle("d-none", true);
  spinner.classList.toggle("d-none", false);
  downloadBtn.classList.toggle("d-none", false);

  let format;
  for (const radioBtn of radioButtons) {
    if (radioBtn.checked) format = radioBtn.value;
  }
  // Construct QR Code URI
  const qrCodeURI = getQRCodeImage(inputValue, undefined, format);

  imgNode.src = qrCodeURI;
  downloadBtn.href = qrCodeURI;
  spinner.classList.toggle("d-none", true);
  imgWrapper.classList.toggle("d-none", false);
});

const getQRCodeImage = (text, size = { w: 100, h: 100 }, format = "jpg") => {
  const URI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    text
  )}&size=${encodeURIComponent(
    `${size.w}x${size.h}`
  )}&format=${encodeURIComponent(format)}`;
  return URI;
};
