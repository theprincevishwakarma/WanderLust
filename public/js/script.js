(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

const filterList = document.querySelector("#filterList");
const leftBtn = document.querySelector("#leftBtn");
const rightBtn = document.querySelector("#rightBtn");

rightBtn.addEventListener("click", () => {
  filterList.scrollBy({
    left: 300,
    behavior: "smooth",
  });
});

leftBtn.addEventListener("click", () => {
  filterList.scrollBy({
    left: -300,
    behavior: "smooth",
  });
});

const searchBox = document.querySelector(".search");
const text = "Your next destination";

let index = 0;

function typeEffect() {
  searchBox.placeholder = text.slice(0, index);
  index++;

  if (index <= text.length) {
    setTimeout(typeEffect, 65);
  }
}

typeEffect();
