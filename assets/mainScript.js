const newsFolder = "./assets/aktualnosci_content";

$(document).ready(function () {
    const $navbarLinks = $('#navbarSupportedContent .nav-link');
    const $content = $("#content");
    const $navbarCollapse = $('.navbar-collapse');

    $navbarLinks.click(function () {
        $navbarLinks.removeClass('active');
        $(this).addClass('active');
        const page = $(this).attr("data-page");

        $content.addClass('fade-out');

        setTimeout(() => {
            $.get(`data_page_content/${page}.html`)
                .done(function (data) {
                    $content.html(data).removeClass('fade-out');

                    if (page === "aktualnosci") {
                        console.log("Strona aktualności załadowana");
                        newsPageScript();
                    }
                });
        }, 300);

        $navbarCollapse.collapse('hide');
    });

    $content.addClass('fade-out');
    loadInitialContent();
});

function loadInitialContent() {
    setTimeout(() => {
        $.get("data_page_content/strona_glowna.html")
            .done(function (data) {
                $("#content").html(data).removeClass('fade-out');
            });
    }, 300);
}

function newsPageScript() {
    // const newsGrid = document.getElementById('news-grid');
    // const skeletonTiles = Array.from({ length: 2 }, () => `
    //     <div class="col-lg-3 col-md-6 news-tile loaded">
    //         <div class="card">
    //             <div class="placeholder-glow">
    //                 <div class="placeholder card-img-top" style="height: 200px; width: 100%;"></div>
    //             </div>
    //             <div class="card-body">
    //                 <h5 class="placeholder-glow"><span class="placeholder col-6"></span></h5>
    //                 <p class="placeholder-glow">
    //                     <span class="placeholder col-7"></span>
    //                     <span class="placeholder col-4"></span>
    //                     <span class="placeholder col-4"></span>
    //                     <span class="placeholder col-6"></span>
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // `).join('');

    // newsGrid.innerHTML += skeletonTiles;
    setTimeout(()=>{
        fetchNewsData();
    }, 300)
}

function fetchNewsData() {
    fetch(`${newsFolder}/data.json`)
        .then(response => {
            if (!response.ok) throw new Error('Something went wrong');
            return response.json();
        })
        .then(data => {
            const newsGrid = document.getElementById("news-grid");
            newsGrid.innerHTML = data.news.map((news, index) => `
                <div class="col-lg-3 col-md-6 news-tile true-card">
                    <div class="card">
                        <img src="${newsFolder}/${news.folder}/image1.jpg" class="card-img-top" alt="${news.title}" loading="lazy">
                        <div class="card-body">
                            <h5 class="news-title">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#newsModal" data-index="${index}" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                                ${news.title}
                                </a>
                            </h5>
                            <p class="news-description">${news.description_short}</p>
                        </div>
                    </div>
                </div>
            `).join('');

            const trueCards = document.querySelectorAll('.true-card')
            setTimeout(()=>{
                trueCards.forEach(card => {
                    card.classList.add('true-card-transition')
                });
            },1)

            const newsModal = document.getElementById('newsModal');
            newsModal.addEventListener('show.bs.modal', function (event) {
                const button = event.relatedTarget;
                const newsIndex = button.getAttribute('data-index');
                const selectedNews = data.news[newsIndex];

                const modalTitle = newsModal.querySelector('.modal-title');
                modalTitle.textContent = selectedNews.title;

                const modalDescription = newsModal.querySelector('#modal-description');
                modalDescription.textContent = selectedNews.description_all;

                const carouselImages = newsModal.querySelector('#carousel-images');
                carouselImages.innerHTML = Array.from({ length: selectedNews.imgs_count }, (_, i) => `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                        <img src="${newsFolder}/${selectedNews.folder}/image${i + 1}.jpg" class="d-block w-100" alt="Image ${i + 1}">
                    </div>
                `).join('');

            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
