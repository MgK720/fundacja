const newsFolder = "./assets/aktualnosci_content"

$(document).ready(function () {
    $('#navbarSupportedContent .nav-link').click(function () {
        $('#navbarSupportedContent .nav-link').removeClass('active');
        $(this).addClass('active');
        let page = $(this).attr("data-page");
        $("#content").addClass('fade-out');

        setTimeout(function () {
            $.get("data_page_content/" + page + ".html", function (data) {
                $("#content").html(data);
            }).done(function () {
                $("#content").removeClass('fade-out');

                if (page === "aktualnosci") {
                    console.log("Strona aktualności załadowana");
                    newsPageScript();
                }
            });
        }, 500);

        $('.navbar-collapse').collapse('hide');
    });

    $("#content").addClass('fade-out');

    setTimeout(function () {
        $.get("data_page_content/" + "strona_glowna" + ".html", function (data) {
            $("#content").html(data);
        }).done(function () {
            $("#content").removeClass('fade-out');
        });
    }, 500);
});

function newsPageScript() {
    const newsGrid = document.getElementById('news-grid');

    for (let i = 0; i < 4; i++) {
        const skeletonTile = `
        <div class="col-lg-3 col-md-6 news-tile loaded">
            <div class="card">
                <div class="placeholder-glow">
                    <div class="placeholder card-img-top" style="height: 200px; width: 100%;"></div>
                </div>
                <div class="card-body">
                    <h5 class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                    </p>
                </div>
            </div>
        </div>
        `;
        newsGrid.innerHTML += skeletonTile;
    }

    fetchNewsData();
}

function fetchNewsData() {
    fetch(newsFolder + "/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            return response.json();
        })
        .then(data => {
            const newsGrid = document.getElementById("news-grid");
            newsGrid.innerHTML = '';

            data.news.forEach((news, index) => {
                const newsTile = `
                <div class="col-lg-3 col-md-6 news-tile true">
                    <div class="card">
                        <img src="${newsFolder}/${news.folder}/image1.jpg" class="card-img-top" alt="${news.title}" loading="lazy">
                        <div class="card-body">
                            <h5 class="news-title news-show-modal-button">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#newsModal" data-index="${index}" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                                ${news.title}
                                </a>
                            </h5>
                            <p class="news-description">${news.description_short}</p>
                        </div>
                    </div>
                </div>
                `;
                newsGrid.innerHTML += newsTile;
            });

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
                carouselImages.innerHTML = '';
                for (let i = 1; i <= 3; i++) {
                    carouselImages.innerHTML += `
                    <div class="carousel-item ${i === 1 ? 'active' : ''}">
                        <img src="${newsFolder}/${selectedNews.folder}/image${i}.jpg" class="d-block w-100" alt="Image ${i}">
                    </div>
                    `;
                }
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
