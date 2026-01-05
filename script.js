$(document).ready(function () {
    // 1. 변수 선언 (딱 한 번만)
    let currentIndex = 0;
    const bgImages = document.querySelectorAll('.bg-image');
    const totalImages = bgImages.length;
    let slideInterval;
    
    let isCarouselAutoRotated = false; // 자동 회전 여부 (중복 방지)
    let currentRotateY = 0; // 현재 회전 각도 저장

    // 2. 메인 배경 슬라이드쇼 함수
    function startSlideShow() {
        if (slideInterval) return;
        slideInterval = setInterval(() => {
            bgImages[currentIndex].classList.remove('active');
            bgImages[currentIndex].classList.add('prev');
            currentIndex = (currentIndex + 1) % totalImages;
            bgImages[currentIndex].classList.remove('prev');
            bgImages[currentIndex].classList.add('active');
        }, 3000);
    }

    // 3. 캐러셀 회전 실행 함수
    function rotateCarousel(deg) {
        currentRotateY += deg;
        // vanilla JS와 jQuery 충돌 방지를 위해 확실히 id를 지정하여 변형 적용
        const $inner = $("#carouselInner");
        if($inner.length > 0) {
            $inner.css("transform", `rotateY(${currentRotateY}deg)`);
        }
    }

    // 4. 스크롤 통합 이벤트 (Window Scroll 하나로 합침)
    $(window).on('scroll', function() {
        const scrollValue = $(window).scrollTop();
        const windowHeight = $(window).height();

        // [A] 헤더 및 로고 상태 제어
        if (scrollValue > 50) {
            $('body').addClass('active');
            $('#main-logo').addClass('scrolled');
            startSlideShow();
        } else {
            $('body').removeClass('active');
            $('#main-logo').removeClass('scrolled');
        }

        // [B] 중간 컨텐츠 이미지 순차 등장 (circle1 등)
        $('.scroll-img').each(function() {
            const rect = this.getBoundingClientRect();
            if (rect.top < windowHeight * 0.9) {
                $(this).addClass('reveal');
            }
        });

        // [C] 캐릭터 섹션 감지 (자동 휙~ 회전)
        const $charSection = $('.character-section');
        if ($charSection.length > 0) {
            const sectionTop = $charSection.offset().top - scrollValue;

            // 섹션이 화면 중앙 근처에 오면 실행
            if (sectionTop < windowHeight * 0.6 && !isCarouselAutoRotated) {
                isCarouselAutoRotated = true; // 딱 한 번만 실행되도록 설정
                
                // 장식 이미지 등장 (circle2, artist)
                $('.char-scroll-img').each(function(index) {
                    setTimeout(() => {
                        $(this).addClass('reveal');
                    }, index * 300);
                });

                // 캐러셀 한 바퀴 휙~ 돌기 (약간의 딜레이 후 실행)
                setTimeout(() => {
                    rotateCarousel(-360); 
                }, 500);
            }
        }
    });

    // 5. 컨트롤 버튼 클릭 이벤트
    $(".next").on("click", function () {
        rotateCarousel(-40); // 왼쪽으로 이동 (카드 개수가 9개일 때 360/9 = 40도)
    });

    $(".prev").on("click", function () {
        rotateCarousel(40); // 오른쪽으로 이동
    });
});