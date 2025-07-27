// Hero Slideshow functionality
document.addEventListener('DOMContentLoaded', function () {
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function showSlide(index) {
        // Hide all slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show the current slide
        heroSlides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    // Initialize slideshow
    if (heroSlides.length > 0) {
        showSlide(currentSlide);
        // Change slide every 4 seconds (adjusted for more images)
        setInterval(nextSlide, 4000);
    }
});