document.querySelectorAll(".has-submenu").forEach(item => {
    item.addEventListener("mouseenter", function () {
      const submenu = this.querySelector(".submenu");
      if (submenu) {
        const rect = submenu.getBoundingClientRect();
        if (rect.left > window.innerWidth) {
          submenu.classList.add("flip");
        } else {
          submenu.classList.remove("flip");
        }
      }
    });
  });
  