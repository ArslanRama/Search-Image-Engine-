window.onload = () => {
    // any code will be written here gonna be executed after the full page loaded

    // get search input  
    const searchInput = document.querySelector('#searchInput')

    // add key up event listener
    searchInput.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            // reset paging to 1
            pageNumInput.value = 1
            // call search function here
            search()
        }
    })

    // add  focus event to search input  so it will be cleared
    searchInput.addEventListener('focus', ()=>{
        searchInput.value= ''
    })

    //get search button
    const searchBtn = document.querySelector('#searchBtn')

    // add click event on search button
    searchBtn.addEventListener('click', () => {
        // reset paging to 1
        pageNumInput.value = 1
        // call search function here
        search()
    })


    const resultDiv = document.querySelector('#resultDiv');

    // get select color element
    const selectColor = document.querySelector('#colorSelect')

    // get select category element
    const selectCategory = document.querySelector('#categorySelect')

    // get select per page element
    const selectPerPage = document.querySelector('#perPageSelect')

    // get page number Input 
    const pageNumInput = document.querySelector('#pageNumInp')
    
    // get next button
    const nextButton = document.querySelector('#nextBtn')

    // get previous button
    const prevBtn = document.querySelector('#prevBtn')

    // get paging navbar
    const pagingNav =  document.querySelector('#pagingNav')

    // add event listener to selectColor so it will run search after changing the color DIRECTLY
    selectColor.addEventListener(`change`, () => {
        search();
      });

    // add event listener to selectCategory so it will run search after changing the category DIRECTLY
    selectCategory.addEventListener(`change`, () => {
        search();
      });

    // add event listener to selectPerPage so it will run search after changing the Per Page DIRECTLY
    selectPerPage.addEventListener(`change`, () => {
        // reset pagging to 1
        pageNumInput.value = 1
        search();
      });

    // add keyup event listener to page number input
    pageNumInput.addEventListener('keyup', e => {
          if (e.keyCode === 13) {
              search()
          }
      })

    // add change event listener to page number input
    pageNumInput.addEventListener('change', () => {
          search()
      })

    // add click event listener for the next button
    nextButton.addEventListener('click', e => {
          e.preventDefault();
          let pageNum = Number(pageNumInput.value);
          pageNumInput.value = pageNum + 1;
          search() 
    })
    // add click event listener for the prev button
    prevBtn.addEventListener('click', e =>{
        e.preventDefault();
        let pageNum = Number(pageNumInput.value);
        pageNumInput.value = pageNum - 1;
          search() 
    })

    // the following variable represent about the number of search result
    let resultNumber = 0;
    

    // search function
    function search() {

        
        // check page number value and active or disable prev button
        if(parseInt(pageNumInput.value) > 1){
            prevBtn.parentElement.classList.remove('disabled')
        } else{
            prevBtn.parentElement.classList.add('disabled')
        }
        const keyWord = searchInput.value
        const url = 'https://pixabay.com/api/?key=12000491-41fc68d8c365df909e022ceb6&q=' + keyWord + 
        (selectColor.value ? '&colors=' + selectColor.value : '') +
        (selectCategory.value ? '&category=' + selectCategory.value : '') +
        (selectPerPage.value ? '&per_page=' + selectPerPage.value : '') +
        (pageNumInput.value ? '&page=' + pageNumInput.value : '') 
       

        fetch(url).then(response => {

            // check response code
            if (response.status === 200) {
                // response.text().then(data => {
                //     console.log(data);
                // })
                response.json().then(data => {
                    // data to deal with
                    console.log(data);

                    // enable or disable next button
                    const pagesNumber = Math.ceil(data.total / parseInt(selectPerPage.value))
                    // console.log(pagesNumber);
                    if (pagesNumber <= parseInt(pageNumInput.value)){
                        nextButton.parentElement.classList.add('disabled')
                    } else {
                        nextButton.parentElement.classList.remove('disabled')
                    }

                    // hide and show the prev and next buttons
                    resultNumber = data.total
                    if (resultNumber >parseInt(selectPerPage.value)){
                       pagingNav.classList.remove('d-none')
                    } else{
                        pagingNav.classList.add('d-none')
                    }

                    // cards
                    let cardsElement = '';
                    data.hits.forEach(hit => {
                        cardsElement += `<div class="card pr-1 col-md-3" >
                        <img class="card-img-top" src="${hit.previewURL}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${hit.user}</h5>
                            <p class="card-text">${hit.tags}</p>
                            <a href="#" class="btn btn-primary" onclick="showModal('${hit.largeImageURL}')">Show</a>
                        </div>
                    </div>`
                    });
                    resultDiv.innerHTML = cardsElement;
                }).catch(error => {
                    console.log(error);
                })
            } else {
                console.log(response.status);
            }


        }).catch(error => {
            console.log(error);
        })

    }

}
/**
     * show image modal
     * @param {String} imageUrl 
     */
function showModal(imageUrl) {
    $('#imageModal').modal('show');
    document.querySelector('#largImage').src = imageUrl
}

