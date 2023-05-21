const fileInput = document.getElementById("upload-file");
const crossBtn = document.getElementById("upload-cancel");
let overlayElement = document.querySelector(".img-upload__overlay");
let imageElement = document.querySelector(".img-upload__preview img");
const mainForm = document.getElementById("upload-select-image");
const submitButton = document.getElementById("upload-submit");
const galleryElement = document.getElementById("img-container");

let currentRange = 100;
let scaleSmaller = document.querySelector(
  ".scale__control.scale__control--smaller"
);

let scaleBigger = document.querySelector(
  ".scale__control.scale__control--bigger"
);
let scaleValue = document.querySelector(
  ".scale__control.scale__control--value"
);

function validateDescription() {
  let textDesc = document.querySelector(".text__description");

  const description = textDesc.value.trim();
  return description.length >= 20 && description.length <= 140;
}

scaleSmaller.addEventListener("click", () => {
  changeRangeValue(-25);
});
scaleBigger.addEventListener("click", () => {
  changeRangeValue(25);
});
const changeRangeValue = (num) => {
  console.log(num);
  console.log(imageElement.style.transform);
  console.log(0);
  console.log(currentRange);
  if (currentRange + num > 100) {
    console.log(1);
    currentRange = 100;
    scaleValue.value = `${currentRange}%`;
    let scaleNum = 1; // Пример нового значения масштаба

    imageElement.style.transform = "scale(" + scaleNum + ")";

    return;
  }
  if (currentRange + num < 25) {
    currentRange = 25;
    console.log(2);
    scaleValue.value = `${currentRange}%`;
    let scaleNum = 0.25; // Пример нового значения масштаба
    imageElement.style.transform = "scale(" + scaleNum + ")";

    return;
  }

  let scaleNum = currentRange / 100 + num / 100; // Пример нового значения масштаба
  currentRange += num;
  scaleValue.value = `${currentRange}%`;

  imageElement.style.transform = "scale(" + scaleNum + ")";
  console.log(imageElement.style.transform);
  console.log(3);
};

crossBtn.addEventListener("click", () => {
  closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const closeModal = () => {
  overlayElement.classList.add("hidden");
  document.body.classList.remove("modal-open");
  fileInput.value = "";
};

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    console.log(reader.result);
    imageElement.src = reader.result;
    imageElement.style.transform = "scale(" + currentRange / 100 + ")";

    overlayElement.classList.remove("hidden");

    document.body.classList.add("modal-open");

    let styleElement = document.createElement("style");
    styleElement.innerHTML = `.effects__preview { background-image: url("${reader.result}"); }`;
    document.head.appendChild(styleElement);
  });

  reader.readAsDataURL(file);
});

function applyEffect(effectName) {
  let previewElement = document.querySelector(".img-upload__preview img");

  // Удалить все возможные классы эффектов
  previewElement.classList.remove(
    "effects__preview--chrome",
    "effects__preview--sepia",
    "effects__preview--marvin",
    "effects__preview--phobos",
    "effects__preview--heat"
  );

  // Добавить класс эффекта в зависимости от входного значения
  if (effectName === "chrome") {
    previewElement.classList.add("effects__preview--chrome");
  } else if (effectName === "sepia") {
    previewElement.classList.add("effects__preview--sepia");
  } else if (effectName === "marvin") {
    previewElement.classList.add("effects__preview--marvin");
  } else if (effectName === "phobos") {
    previewElement.classList.add("effects__preview--phobos");
  } else if (effectName === "heat") {
    previewElement.classList.add("effects__preview--heat");
  }
}
let radioInputs = document.querySelectorAll(".effects__radio");

// Добавить обработчик события 'change' к каждому элементу <input>
radioInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    let selectedEffect = this.value; // Значение выбранного эффекта
    console.log(selectedEffect);
    applyEffect(selectedEffect); // Вызов функции applyEffect с выбранным эффектом
  });
});
console.log(mainForm);
document.addEventListener("click", (event) => {
  console.log(event.target.classList.value);
  if (event.target.classList.value !== "img-upload__preview") {
    closeModal();
  }
});
mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateDescription()) {
    alert("Incorrect comment");
    return;
  }
  let textDesc = document.querySelector(".text__description");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("description", textDesc.value);
  submitButton.disabled = true;

  fetch("https://27.javascript.pages.academy/kekstagram-simple", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      submitButton.disabled = false;

      if (response.ok) {
        closeModal();
        console.log("File is loaded");
        fileInput.value = "";
        textDesc.value = "";
        const template = document.getElementById("success");
        const clone = template.content.cloneNode(true);

        document.body.appendChild(clone);

        successButton.addEventListener("click", closeSuccessSection);

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            closeSuccessSection();
          }
        });

        document.addEventListener("click", (event) => {
          if (event.target.classList.value !== "success__inner") {
            closeSuccessSection();
          }
        });
      } else if (response.status === 400) {
        throw new Error("Bad request");
      } else {
        throw new Error("Request failed with status " + response.status);
      }
    })
    .catch((error) => {
      closeModal();
      const template = document.getElementById("error");
      const clone = template.content.cloneNode(true);
      document.body.appendChild(clone);
      const errorButton = document.querySelector(".error__button");
      const errorSection = document.querySelector(".error");

      // Функция для закрытия блока сообщения об ошибке
      const closeErrorSection = () => {
        errorSection.remove();
      };

      errorButton.addEventListener("click", closeErrorSection);

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeErrorSection();
        }
      });

      document.addEventListener("click", (event) => {
        if (event.target.classList.value !== "error__inner") {
          closeErrorSection();
        }
      });

      console.log("Error while loading:", error);
    });
});

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
    console.log(error);
  });

function displayThumbnails(imagesData) {
  const pictureTemplate = document.querySelector("#picture");

  imagesData.forEach((imageData) => {
    const picture = pictureTemplate.content.cloneNode(true);
    const pictureImg = picture.querySelector(".picture__img");
    const pictureComments = picture.querySelector(".picture__comments");
    const pictureLikes = picture.querySelector(".picture__likes");

    pictureImg.src = imageData.url;
    pictureImg.alt = imageData.description;
    pictureComments.textContent = imageData.comments;
    pictureLikes.textContent = imageData.likes;

    galleryElement.appendChild(picture);
  });
  //   imagesData.forEach((imageData) => {
  //     const thumbnail = createThumbnail(imageData);
  //     galleryElement.appendChild(thumbnail);
  //   });
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
