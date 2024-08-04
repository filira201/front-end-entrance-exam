const downloadButton = document.getElementById("download-button");
const deleteButton = document.getElementById("delete-button");

const editableElements = document.querySelectorAll(".editable");

const fillLocalStorageDefaultValues = (editableElements) => {
  const data = {};
  editableElements.forEach((editableElement, index) => {
    data[editableElement.className + index] = {
      defaultValue: editableElement.textContent.trim(),
      editedValue: null,
    };
  });
  localStorage.setItem("data", JSON.stringify(data));
};

if (!localStorage.getItem("data")) {
  fillLocalStorageDefaultValues(editableElements);
}

const data = JSON.parse(localStorage.getItem("data"));

editableElements.forEach((editableElement, index) => {
  const key = editableElement.className + index;
  const savedText = data[key];
  if (savedText.editedValue !== null) {
    editableElement.textContent = savedText.editedValue;
  }

  editableElement.addEventListener("blur", () => {
    const defaultValue = data[key].defaultValue;
    const previousValue = data[key].editedValue;

    if (
      defaultValue !== editableElement.textContent.trim() &&
      previousValue !== editableElement.textContent.trim()
    ) {
      editableElement.style.animationName = "none";
      setTimeout(() => {
        editableElement.style.animationName = "change-saved";
      });

      data[key].editedValue = editableElement.textContent.trim();
      localStorage.setItem("data", JSON.stringify(data));
    }
  });
});

deleteButton.addEventListener("click", () => {
  editableElements.forEach((editableElement, index) => {
    const key = editableElement.className + index;
    const defaultText = data[key].defaultValue;

    editableElement.textContent = defaultText;
    data[key].editedValue = null;
  });

  localStorage.setItem("data", JSON.stringify(data));
});

downloadButton.addEventListener("click", () => {
  const element = document.getElementById("element-to-print");

  const opt = {
    margin: 1,
    filename: "myResume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
});
