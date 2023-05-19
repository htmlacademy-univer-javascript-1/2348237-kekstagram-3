const fileInput = document.getElementById("upload-file");
const previewImage = document.getElementById("img-edit-form");
const imageBlock = document.getElementById("image-block");
const imageEffects = document.getElementById("image-effects");
const submitForm = document.getElementById("form-img");
const imageDescription = document.getElementById("description-input");
const submitButton = document.getElementById("submit-button");

const crossBtn = document.getElementById("cross");
let currentRange = 50;

const closeModal = () => {
  previewImage.classList.add("hidden");
  const body = document.querySelector("body");
  body.classList.remove("modal-open");
  fileInput.value = "";
};
const changeRangeValue = (num) => {
  console.log(currentRange);
  if (currentRange + num > 75 || currentRange + num < 25) return;

  currentRange += num;
  document.getElementById("zoom-value").textContent = `${currentRange}%`;
  document.getElementById("input-range").value = currentRange;
  document.getElementById("original-image").style.transform = `scale(${
    currentRange * 0.02
  })`;
};
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

crossBtn.addEventListener("click", () => {
  closeModal();
});

fileInput.addEventListener("change", () => {
  imageBlock.innerHTML = "";
  imageEffects.innerHTML = "";
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    previewImage.classList.remove("hidden");
    const body = document.querySelector("body");
    body.classList.add("modal-open");

    const newImage = document.createElement("img");
    newImage.id = "original-image";
    newImage.src = reader.result;
    newImage.alt = " image";
    imageBlock.appendChild(newImage);

    const inputRange = document.createElement("input");
    inputRange.id = "input-range";
    inputRange.type = "range";
    inputRange.min = "1";
    inputRange.max = "100";
    inputRange.value = currentRange;
    inputRange.classList.add("range");
    inputRange.addEventListener("change", () => {
      let scl = inputRange.value * 0.02;
      currentRange = scl * 50;
      newImage.style.transform = `scale(${scl})`;
      document.getElementById("zoom-value").textContent = `${scl * 50}%`;
    });
    imageBlock.appendChild(inputRange);

    const zoomBlock = document.createElement("div");
    zoomBlock.classList.add("zoom-block");

    const minusBtn = document.createElement("span");
    minusBtn.classList.add("zoom-btn");
    minusBtn.addEventListener("click", () => {
      console.log(1);
      changeRangeValue(-25);
    });
    minusBtn.textContent = "-";
    zoomBlock.appendChild(minusBtn);
    const zoomValue = document.createElement("span");
    zoomValue.classList.add("zoom-value");

    zoomValue.textContent = `${currentRange}%`;
    zoomValue.id = "zoom-value";
    zoomBlock.appendChild(zoomValue);

    const plusBtn = document.createElement("span");
    plusBtn.classList.add("zoom-btn");
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
      changeRangeValue(25);
    });
    zoomBlock.appendChild(plusBtn);
    imageBlock.appendChild(zoomBlock);
    // Original effect >>>
    const effectBlock = document.createElement("div");
    imageEffects.appendChild(effectBlock);
    effectBlock.classList.add("effect-col");

    const originalImage = document.createElement("img");
    originalImage.src = reader.result;
    originalImage.alt = " image";

    effectBlock.appendChild(originalImage);
    const text = document.createElement("p");
    text.textContent = "Оригинал";
    effectBlock.appendChild(text);
    effectBlock.addEventListener("click", () => {
      newImage.classList.remove(
        "sepia",
        "black-white",
        "invert",
        "filter-fobos"
      );
    });
    //<< Original effect

    const effectSepia = document.createElement("div");
    imageEffects.appendChild(effectSepia);
    effectSepia.classList.add("effect-col");

    const sepiaImage = document.createElement("img");

    sepiaImage.src = reader.result;
    sepiaImage.alt = " image";
    sepiaImage.classList.add("sepia");

    effectSepia.appendChild(sepiaImage);
    const sepiaText = document.createElement("p");
    sepiaText.textContent = "Сепия";
    effectSepia.appendChild(sepiaText);

    // Add event listener to the sepia effect block
    effectSepia.addEventListener("click", () => {
      newImage.classList.remove("black-white", "invert", "filter-fobos");

      newImage.classList.add("sepia");
    });

    // Black and White effect >>>
    const effectBW = document.createElement("div");
    imageEffects.appendChild(effectBW);
    effectBW.classList.add("effect-col");

    const bwImage = document.createElement("img");

    bwImage.src = reader.result;
    bwImage.alt = " image";
    bwImage.classList.add("black-white");

    effectBW.appendChild(bwImage);
    const bwText = document.createElement("p");
    bwText.textContent = "Хром";
    effectBW.appendChild(bwText);

    // Add event listener to the black and white effect block
    effectBW.addEventListener("click", () => {
      newImage.classList.remove("sepia", "invert", "filter-fobos");

      newImage.classList.add("black-white");
    });

    // Inverted colors effect >>>
    const effectInvert = document.createElement("div");
    imageEffects.appendChild(effectInvert);
    effectInvert.classList.add("effect-col");

    const invertImage = document.createElement("img");
    invertImage.src = reader.result;
    invertImage.alt = " image";
    invertImage.classList.add("invert");

    effectInvert.appendChild(invertImage);
    const invertText = document.createElement("p");
    invertText.textContent = "Марвин";
    effectInvert.appendChild(invertText);

    // Add event listener to the inverted colors effect block
    effectInvert.addEventListener("click", () => {
      newImage.classList.remove("sepia", "black-white", "filter-fobos");

      newImage.classList.add("invert");
    });

    // Brightness effect >>>
    const effectBrightness = document.createElement("div");
    imageEffects.appendChild(effectBrightness);
    effectBrightness.classList.add("effect-col");

    const brightnessImage = document.createElement("img");
    brightnessImage.src = reader.result;
    brightnessImage.alt = " image";
    brightnessImage.classList.add("filter-fobos");

    effectBrightness.appendChild(brightnessImage);
    const brightnessText = document.createElement("p");
    brightnessText.textContent = "Блюр";
    effectBrightness.appendChild(brightnessText);

    // Add event listener to the brightness effect block
    effectBrightness.addEventListener("click", () => {
      newImage.classList.remove("sepia", "black-white", "invert");

      newImage.classList.add("filter-fobos");
    });
  });

  reader.readAsDataURL(file);
});
function validateDescription() {
  const description = imageDescription.value.trim();
  return description.length >= 20 && description.length <= 140;
}
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateDescription()) {
    alert("Enter correct comment");
    return;
  }
  submitButton.disabled = true;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("description", imageDescription.value);

  fetch("https://27.javascript.pages.academy/kekstagram-simple", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      submitButton.disabled = false;

      if (response.ok) {
        closeModal();
        console.log("File is loaded");
        successTemplate.style.display = "block";
      } else {
        errorTemplate.style.display = "block";

        console.log("error while loading");
      }
    })
    .catch((error) => console.log(error));
});

const galleryElement = document.getElementById("img-container");

fetch("https://27.javascript.pages.academy/kekstagram-simple/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных с сервера");
    }
    return response.json();
  })
  .then((data) => {
    displayThumbnails(data);
  })
  .catch((error) => {
    alert(error);
  });

function displayThumbnails(imagesData) {
  imagesData.forEach((imageData) => {
    const thumbnail = createThumbnail(imageData);
    galleryElement.appendChild(thumbnail);
  });
}

function createThumbnail(imageData) {
  const thumbnail = document.createElement("div");
  thumbnail.classList.add("thumbnail");

  const image = document.createElement("img");

  const remoteImage = new Image();
  remoteImage.src = imageData.url;

  remoteImage.addEventListener("load", () => {
    image.src = remoteImage.src;
    image.alt = imageData.description;
  });

  remoteImage.addEventListener("error", () => {
    // Путь к локальному изображению
    image.src = "img/cat.jpeg";
    image.alt = imageData.description;
  });

  thumbnail.appendChild(image);
  return thumbnail;
}

// temp;ates

// Получаем шаблон и элемент, перед которым нужно добавить сообщение
const errorTemplate = document.querySelector("#error-template");

const errorButton = document.getElementById("errorButton");

// Показываем сообщение
console.log(errorTemplate.style.display);
// Добавляем обработчик на кнопку "Ок"
errorButton.addEventListener("click", () => {
  console.log(1);
  errorTemplate.style.display = "none";
});

// Добавляем обработчик на клавишу "Esc"
document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    errorTemplate.style.display = "none";
  }
});

// Добавляем обработчик на клик вне блока сообщения
document.addEventListener("click", (evt) => {
  if (!errorTemplate.contains(evt.target)) {
    errorTemplate.style.display = "none";
  }
});
errorTemplate.style.display = "none";

// Получаем шаблон и элемент, перед которым нужно добавить сообщение
const successTemplate = document.querySelector("#success-template");

const successButton = document.getElementById("successButton");

// Показываем сообщение
console.log(successTemplate.style.display);

// Добавляем обработчик на кнопку "Ок"
successButton.addEventListener("click", () => {
  console.log(1);
  successTemplate.style.display = "none";
});

// Добавляем обработчик на клавишу "Esc"
document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    successTemplate.style.display = "none";
  }
});

// Добавляем обработчик на клик вне блока сообщения
document.addEventListener("click", (evt) => {
  if (!successTemplate.contains(evt.target)) {
    successTemplate.style.display = "none";
  }
});

successTemplate.style.display = "none";
