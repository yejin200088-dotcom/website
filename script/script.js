let currentIndex = 0;
const bgImages = document.querySelectorAll('.bg-image');
const totalImages = bgImages.length;
let slideInterval; // 인터벌 제어용 변수

// 1. 배경 슬라이드 함수
function startSlideShow() {
    if (slideInterval) return; // 이미 실행 중이면 중복 방지

    slideInterval = setInterval(() => {
        // 현재 이미지에서 active 제거하고 prev 추가 (왼쪽으로 퇴장)
        bgImages[currentIndex].classList.remove('active');
        bgImages[currentIndex].classList.add('prev');

        // 다음 인덱스 계산
        currentIndex = (currentIndex + 1) % totalImages;

        // 다음 이미지에 active 추가 (오른쪽에서 등장)
        bgImages[currentIndex].classList.remove('prev');
        bgImages[currentIndex].classList.add('active');
    }, 3000); // 3초
}

function stopSlideShow() {
    clearInterval(slideInterval);
    slideInterval = null;
}

// 2. 스크롤 이벤트 (기존 로직 유지)
window.addEventListener('scroll', function() {
    const scrollValue = window.scrollY;
    const header = document.querySelector('.intro-header');
    const logo = document.getElementById('main-logo');

    if (scrollValue > 50) {
        header.classList.add('active');
        logo.classList.add('scrolled');
        document.body.classList.add('active');
        
        startSlideShow(); // 스크롤 내리면 슬라이드 시작
    } else {
        header.classList.remove('active');
        logo.classList.remove('scrolled');
        document.body.classList.remove('active');
        
        // 다시 맨 위로 올라가면 멈추고 싶을 때 (선택사항)
        // stopSlideShow(); 
    }
});

// 초기 실행 (첫 화면부터 슬라이드가 돌아가게 하고 싶다면 호출)
// startSlideShow();

window.addEventListener('scroll', function() {
    const scrollValue = window.scrollY;
    const contentTop = document.querySelector('.content').offsetTop;
    const imgs = document.querySelectorAll('.scroll-img');

    // 1. 기존 로고 및 배경 슬라이드 로직
    if (scrollValue > 50) {
        document.body.classList.add('active');
        document.getElementById('main-logo').classList.add('scrolled');
        startSlideShow();
    } else {
        document.body.classList.remove('active');
        document.getElementById('main-logo').classList.remove('scrolled');
    }

    // 2. bg11이 화면 상단에 닿은 시점부터 이미지 순차 등장
    // 스크롤 한 번 내릴 때마다(약 400~600px 간격) 하나씩 등장
    imgs.forEach((img, index) => {
        // 첫 번째 이미지는 contentTop 도착 시, 
        // 나머지는 그로부터 200px, 4000px 더 내려갔을 때 각각 실행
        const triggerGap = index * 120; 
        
        if (scrollValue > (contentTop + triggerGap - 200)) { 
            img.classList.add('reveal');
        } else {
            img.classList.remove('reveal');
        }
    });
});

// 2. 캐러셀 업데이트 로직
function updateCarousel() {
    let activeSlide = $(".c-3d-carousel__item-active").data("slide");

    $(".c-3d-carousel__item").each(function () {
        let slideNumber = $(this).data("slide");
        let diff = slideNumber - activeSlide;

        $(this).prop("class", "c-3d-carousel__item");

        if (diff === 0) {
            $(this).addClass("c-3d-carousel__item-active");
        } else if (diff > 0) {
            $(this).addClass("c-3d-carousel__item-after c-3d-carousel__item-after--" + diff);
        } else {
            $(this).addClass("c-3d-carousel__item-before c-3d-carousel__item-before--" + Math.abs(diff));
        }
    });
}


// 4. 캐러셀 버튼 및 클릭 이벤트 (jQuery)
$(document).ready(function () {
    $(".c-3d-carousel__item").on("click", function () {
        $(".c-3d-carousel__item").removeClass("c-3d-carousel__item-active");
        $(this).addClass("c-3d-carousel__item-active");
        updateCarousel();
    });

    $(".next").on("click", function () {
        let current = $(".c-3d-carousel__item-active");
        let next = current.next(".c-3d-carousel__item");
        if (next.length === 0) next = $(".c-3d-carousel__item").first();
        next.click();
    });

    $(".prev").on("click", function () {
        let current = $(".c-3d-carousel__item-active");
        let prev = current.prev(".c-3d-carousel__item");
        if (prev.length === 0) prev = $(".c-3d-carousel__item").last();
        prev.click();
    });

    updateCarousel(); // 초기 실행
});