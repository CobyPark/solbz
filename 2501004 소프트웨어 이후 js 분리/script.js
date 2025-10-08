$(document).ready(function () {
  // 메인 포트폴리오 캐러셀
  const swiper = new Swiper('.swiper-main', {
    slidesPerView: 3,
    slidesBetween: 20,
    loop: true,
    centeredSlides: true,
    pagination: { el: '.swiper-pagination' },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  // 협력업체 캐러셀
  const swiper_cooperation = new Swiper('.swiper_cooperation', {
    slidesPerView: 4,
    spaceBetween: 70,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    }
  });

  // 소프트웨어 캐러셀
  const swiper_software = new Swiper('.swiper-software', {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true
    },
    navigation: {
      nextEl: '.software .swiper-button-next',
      prevEl: '.software .swiper-button-prev'
    }
  });

  // 부드러운 스크롤
  $('.nav a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const target = $($(this).attr('href'));
    if (target.length) {
      $('html, body').animate({ scrollTop: target.offset().top }, 400);
    }
  });

  swiper_cooperation.update();
  console.log(swiper_cooperation.slides.length);
});