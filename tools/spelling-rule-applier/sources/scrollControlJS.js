
  document.addEventListener('DOMContentLoaded', function () {
    const scrollBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 200) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });
  });
