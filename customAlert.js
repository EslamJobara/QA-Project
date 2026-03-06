function showCustomAlert(title, message, isConfirm = false, onConfirm = null) {
  // Create modal container
  const modalObj = document.createElement("div");
  modalObj.className = "custom-modal-overlay";
  
  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "custom-modal";
  
  const titleEl = document.createElement("h2");
  titleEl.textContent = title;
  
  const messageEl = document.createElement("p");
  messageEl.textContent = message;
  
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "custom-modal-buttons";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "confirm-btn";
  confirmBtn.textContent = isConfirm ? "Yes" : "OK";
  
  confirmBtn.addEventListener("click", () => {
    document.body.removeChild(modalObj);
    if (onConfirm) onConfirm();
  });

  buttonsDiv.appendChild(confirmBtn);

  if (isConfirm) {
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(modalObj);
    });
    buttonsDiv.appendChild(cancelBtn);
  }

  modalContent.appendChild(titleEl);
  modalContent.appendChild(messageEl);
  modalContent.appendChild(buttonsDiv);
  modalObj.appendChild(modalContent);
  document.body.appendChild(modalObj);
}
