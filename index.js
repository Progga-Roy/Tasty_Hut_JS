
const body = document.getElementById('body');
const header = document.createElement('header');
const main = document.createElement('main');
const section = document.createElement('section');
section.classList.add('section');
section.innerHTML = `
    <img class="banner" src="./image/vegetables-set-left-black-slate.jpg"/>
    <div class="banner-information">
        <div class="title-para">
            <h1>Taste Our Delicious <br> Best Foods</h1>
            <p>"Step into the world of culinary magic at our award-winning restaurant where our chefs <br> create dishes that are not only delicious, but visually stunning as well"</p>
        </div>
        <div class="search-div">
            <input id="search-field" type="text" placeholder=" Search any food...">
            <button id="search-btn">Search</button>
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
    </div>

    <div>
    <h1 id="loader">Loading.......</h1>
    </div>
`;

header.classList.add('header');
header.innerHTML = `
    <nav class="nav-bar">
        <a class="logo" href="#">Tasty HUT</a>
        <ul class="nav-menu">
            <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">About</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">API</a>
            </li>
        </ul>
        <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </nav>
`;

body.appendChild(header);
body.appendChild(main);
main.appendChild(section);
let isLoading = false;
const getLoader = () => {
    if (isLoading) {
        // console.log(isLoading)
        document.querySelector('#loader').style.display = 'block'
    }
    else {
        document.querySelector('#loader').style.display = 'none'
    }
}
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

const showAllContainer = document.createElement('div');
showAllContainer.classList.add('showAll-container');
const showBtn = document.createElement('button');
showBtn.classList.add('show-btn');
showBtn.innerText = "Show All";
showBtn.style.display = 'none';
showAllContainer.appendChild(showBtn);
body.appendChild(showAllContainer);

const getMealFromAPI = async () => {
    isLoading = true;
    getLoader()
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
    const data = await res.json();
    isLoading = false;
    getLoader()
    if (data.meals && data.meals.length > 6) {
        showBtn.style.display = 'block';
    }

    displayMealFromAPI(data, 6);
};

getMealFromAPI();

const displayMealFromAPI = (data, initialCount) => {
    console.log(data)
    const title = document.createElement('h1');
    title.classList.add('heading');
    title.innerText = 'Your Favorite Food';
    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meal-container');
    if (!data.meals || data.meals.length === 0) {
        const noFoundMsg = document.createElement('h1');
        noFoundMsg.classList.add('no-found-msg');
        noFoundMsg.innerText = "No found any food. Try another search!!";
        body.appendChild(noFoundMsg);
        const title = document.querySelector('.heading')
        if (title) {
            title.remove()
        }
        showBtn.style.display = 'none';
    } else {
        data.meals.slice(0, initialCount).forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('meal');
            mealDiv.innerHTML += `
                <div class="meal-img">
                    <img class="img" src=${meal.strMealThumb} alt="">
                </div>
                <div class="meal-info">
                    <p class="meal-name" class="name">${meal.strMeal}</p>
                    <p id="meal-instruction" class="instruction" >${meal.strInstructions.slice(0, 100)}...</p>
                    <a class="view-detail" href="#">View Detail</a>
                </div>
            `;
            section.appendChild(title);
            mealContainer.appendChild(mealDiv);
        });
        main.appendChild(mealContainer);

        main.addEventListener('click', (event) => {
            const clickElement = event.target;
            if (clickElement.classList.contains('view-detail')) {
                const mealContainer = clickElement.closest('.meal')
                const mealName = mealContainer.querySelector('.meal-name').innerText;
                // const mealInstruction = mealContainer.querySelector('#meal-instruction').innerText;
                const imgElement = mealContainer.querySelector('.img')
                const mealImg = imgElement ? imgElement.getAttribute('src') : null;
                console.log(mealImg)
                const div = document.querySelector('.modal')
                console.log(modal)
                const selectedMeals = data.meals.find(meals => meals.strMeal === mealName)
                div.innerHTML = `
              <div class="modal-header">
                  <h1 class="modal-title">${mealName}</h1>
                  <span class="close-btn">&times;</span>
              </div>
              <hr class="hr">
             <div class="modal-body">
                 <div class="modal-img"><img src=${mealImg} alt="${mealName}" /><div>
                  <div class="modal-info">
                  <p><span class="bold">Category</span> : ${selectedMeals.strCategory}</p>
                  <p><span class="bold">Area</span> : ${selectedMeals.strArea}</p>
                  <p><span class="bold">Instructions</span> : ${selectedMeals.strInstructions.slice(0, 150)}...</p>
                  <p><span class="bold">YouTube</span> : ${selectedMeals.strYoutube}</p>
                  </div>
            </div>
            <div class="modal-footer">
               <button class="close-btn2">Close</button>
            </div>
               `
                modal.style.display = 'block'
            }

        })

    }

    showBtn.addEventListener('click', () => {
        const previousContainer = document.querySelector('.meal-container');
        if (previousContainer) {
            previousContainer.remove();
        }
        const title = document.querySelector('.heading')
        if (title) {
            title.remove()
        }
        displayMealFromAPI(data, data.meals.length);
        showBtn.style.display = 'none';
    });
};

const searchBtn = document.querySelector('#search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        isLoading = true;
        getLoader()
        const searchValue = document.querySelector('#search-field').value;
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
        const data = await res.json();
       
        const title = document.querySelector('.heading')
        if (title) {
            title.remove()

        }
        const mealContainer = document.querySelector('.meal-container');
        if (mealContainer) {
            mealContainer.remove();
        }
        isLoading = false;
        getLoader()

        if (data.meals && data.meals.length > 6) {
            showBtn.style.display = 'block';
        } else {
            showBtn.style.display = 'none';
        }

        displayMealFromAPI(data, 6);
    });
}


const searchField = document.querySelector('#search-field')
searchField.addEventListener('keypress', async(event)=>{
    if(searchField){
        event.key === 'Enter'
        isLoading = true;
        getLoader()
        const searchText = searchField.value;
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
        const data = await res.json()
        const title = document.querySelector('.heading')
        if (title) {
            title.remove()

        }
        const mealContainer = document.querySelector('.meal-container');
        if (mealContainer) {
            mealContainer.remove();
        }
        isLoading = false;
        getLoader()

        if( data.meals && data.meals.length > 6){
            showBtn.style.display = 'block'
        }
        else{ 
            showBtn.style.display = 'none'
        }
        
        displayMealFromAPI(data, 6)
    }
   
})

const modal = document.createElement('div')
modal.classList.add('modal-container')
modal.innerHTML = `
<div class="modal">
<div class="modal-header">
<h1 class="modal-title"></h1>
<span class="close-btn">&times;</span>
</div>
<div class="modal-body">
 
</div>
<div class="modal-footer">
<button class="close-btn2">Close</button>
</div>
</div>
`
body.appendChild(modal)

document.addEventListener('click', (event) => {
    if (event.target.closest('.modal-header .close-btn') || event.target.closest('.modal-footer .close-btn2')) {
        modal.style.display = 'none';
    }
})

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


const footer = document.createElement('footer')
footer.classList.add('footer')
footer.innerHTML = `
<div class="footer-info">
        <div class="section1">
            <h4>Section</h4>
             <div class="section-info">
             <p href="">Home</p>
             <p href="">Feature</p>
             <p href="">Pricing</p>
             <p href="">FAQ's</p>
             </div>
         </div>
         <div class="section2">
             <h4>Section</h4>
          <div class="section2-info">
          <p href="">UIUX Design</p>
          <p href="">Product Design</p>
          <p href="">Back End Developer</p>
          <p href="">Front End Developer</p>
          </div>
         </div>
         <div class="resources">
             <h4>Resources</h4>
        <div class="resources-info">
        <p href="">FAQ</p>
        <p href="">Support</p>
        <p href="">Privacy Policy</p>
        <p href="">Terms of Service</p>
        </div>
         </div>
         <div class="subscribe">
         <h4>Subscribe to our newsletter</h4>
          <div class="subscribe-info" >
          <p>There are many variations of passages of available, <br> but the majority have suffered.</p>
          <input type="text" placeholder=" Email address">
          <button>Subscribe</button>
          </div>
         </div>
        </div>


`
body.appendChild(footer)