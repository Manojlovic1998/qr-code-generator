const qrForm = document.getElementById("qr-form");
const imgWrapper = document.getElementById("imgWrapper");
const spinner = document.getElementById("spinner");
const downloadBtn = document.getElementById("download-btn");
const radioButtons = document.getElementsByClassName("btn-check");
const textInputNode = document.getElementById("qrInputValue");
const errorMessageNode = document.getElementById("error-message");
const sizeInputNode = document.getElementById("size");
const eccSelectOption = document.getElementById("ecc");
const colorInputNode = document.getElementById("color");
const logoInputNode = document.getElementById("logo");
let logoInputValue;

// NOTE FOR CONTINUINING THE DEVELOPMENT DROP THE EXTERNAL API AS THE IMPORTED PACKAGE IS MORE
// IS MORE POWERFUL, FURTHER DOWNLOAD THE MINIFIED VERSION AND BUNDLE IT WITH THE WHOLE PROJECT

// These options apply to all color pickers on the page
jscolor.presets.default = {
  format: "rgb",
  previewPosition: "left",
  previewSize: 40,
  hideOnPaletteClick: true,
  shadowColor: "rgba(0,0,0,0.1)",
  required: false,
  value: "#000000",
};

const qrGeneratorDefault = {
  size: {
    w: 100,
    h: 100,
  },
  format: "jpg",
};

qrForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const { textInputValue, sizeInputValue, eccSelectedValue, colorInputValue } =
    getFormData();

  // Validation
  let format;
  for (const radioBtn of radioButtons) {
    if (radioBtn.checked) format = radioBtn.value;
  }
  const { isValid, errorMessage, type } = formDataValidation(
    textInputValue,
    sizeInputValue,
    format
  );

  if (!isValid & (type === "text")) {
    errorMessageNode.textContent = errorMessage;
    errorMessageNode.classList.toggle("d-none", false);
    textInputNode.classList.toggle("is-invalid", true);
    return;
  }

  if (!isValid && type === "size") {
    errorMessageNode.textContent = errorMessage;
    errorMessageNode.classList.toggle("d-none", false);
    sizeInputNode.classList.toggle("is-invalid", true);
    return;
  }
  textInputNode.classList.toggle("is-invalid", false);
  errorMessageNode.classList.toggle("d-none", true);

  // Generate QR Code
  const options = {
    text: textInputValue,
    width: Number(sizeInputValue.w),
    height: Number(sizeInputValue.h),
    logo: logoInputValue,
    logoBackgroundTransparent: true,
    drawer: format !== "image/svg+xml" ? "canvas" : "svg",
    colorDark: colorInputValue,
    correctLevel: eccSelectedValue,
  };
  imgWrapper.innerHTML = "";
  getQRCodeImage(options, imgWrapper);

  // For downloading the qr code
  // https://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
  // imgNode.classList.toggle("d-none", true);
});

const getFormData = () => {
  // Extract Form Data
  const textInputValue = textInputNode.value;
  const sizeInputValue = { w: sizeInputNode.value, h: sizeInputNode.value };
  const eccSelectedValue = eccResolver(eccSelectOption.value);
  const colorInputValue = colorInputNode.jscolor.toRGBAString();
  logoInputValue = logoInputNode.files[0]
    ? window.URL.createObjectURL(logoInputNode.files[0])
    : undefined;

  return { textInputValue, sizeInputValue, eccSelectedValue, colorInputValue };
};

const getQRCodeImage = (options, domElement) => {
  // Generate QR Code using Canvas
  new QRCode(domElement, {
    ...options,
    onRenderingEnd: onQRCodeRendered,
  });
};

const onQRCodeRendered = (event) => {
  // Set format
  let format = "image/png";
  for (const radioBtn of radioButtons) {
    if (
      radioBtn.checked &&
      (isRasterFormat(radioBtn.value) || isVectorFormat(radioBtn.value))
    ) {
      format = radioBtn.value;
    }
  }

  // Get Canvas
  const qrCodeRenderer = imgWrapper.children[0];
  // Doc: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
  // Convert canvas to JPG/PNG/WEB

  if (isRasterFormat(format)) {
    const imgURL = qrCodeRenderer.toDataURL(format);

    // create image node
    const imgNode = document.createElement("img");
    imgNode.classList = "img-fluid";
    imgNode.alt = "Your qr code.";
    imgNode.id = "qr-code-image";
    imgNode.src = imgURL;

    // Remove Loader
    spinner.classList.toggle("d-none", true);
    if (qrCodeRenderer) qrCodeRenderer.remove();
    // Remove the canvas renderer because we have now image blob
    imgWrapper.append(imgNode);
    // Show wrapper, Show Image
    imgWrapper.classList.toggle("d-none", false);
    // Show download and setup the download URI
    exportQRCode(imgURL, format);
  }

  if (isVectorFormat(format)) {
    // Hide Image if previously shown

    //imgNode.classList.toggle("d-none", true);

    // get svg source
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(qrCodeRenderer);
    let svgURL;
    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    svgURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    // remove canvas & loader before showing the image
    spinner.classList.toggle("d-none", true);

    console.log(svgURL);
    // Append svg to wrapper
    exportQRCode(svgURL);

    imgWrapper.classList.toggle("d-none", false);
  }

  URL.revokeObjectURL(logoInputValue);
};

const exportQRCode = (imgURI, format) => {
  if (isVectorFormat(format)) {
    downloadBtn.href = imgURI;
  } else {
    downloadBtn.href = imgURI;
    downloadBtn.dataset.downloadurl = [
      format,
      downloadBtn.download,
      downloadBtn.href,
    ].join(":");
  }

  downloadBtn.classList.toggle("d-none", false);
};

const isRasterFormat = (format) => {
  const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

  return mimeTypes.some((mimeType) => mimeType === format);
};

const isVectorFormat = (format) => {
  const mimeTypes = ["image/svg+xml"];

  return mimeTypes.some((mimeType) => mimeType === format);
};

const eccResolver = (eccSelectedValue) => {
  switch (eccSelectedValue) {
    case "L":
      return QRCode.CorrectLevel.L;
    case "M":
      return QRCode.CorrectLevel.M;
    case "Q":
      return QRCode.CorrectLevel.Q;
    case "H":
      return QRCode.CorrectLevel.H;
  }
};

const formDataValidation = (
  text,
  size = { ...qrGeneratorDefault.size },
  format = qrGeneratorDefault.format
) => {
  // If text is an empty string
  if (text.trim() === "") {
    return {
      isValid: false,
      errorMessage: "You can't submit a blank field.",
      type: "text",
    };
  }

  // Min Size Any Format or unequal edge length
  if (size.w < 10 || size.h < 10 || size.h !== size.w) {
    return {
      isValid: false,
      errorMessage: "Size can not be lower than 10x10.",
      type: "size",
    };
  }

  // IsRasterFormat && Max Size
  if (isRasterFormat(format) && (size.w > 1000 || size.h > 1000)) {
    return {
      isValid: false,
      errorMessage:
        "Size can not be larger than 1000x1000 for the following formats: jpg, png, webp.",
      type: "size",
    };
  }

  // isVectorFormat && Max Size
  if (isVectorFormat(format) && (size.w > 1000000 || size.h > 1000000)) {
    return {
      isValid: false,
      errorMessage:
        "Size can not be larger than 1000000x1000000 for the following formats: svg.",
      type: "size",
    };
  }

  return { isValid: true };
};
