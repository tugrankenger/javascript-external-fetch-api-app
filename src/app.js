const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent= document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchControl = document.querySelector(".search-control");

searchBtn.addEventListener('click',getMealList);
mealList.addEventListener('click',getMealRecipe);
recipeCloseBtn.addEventListener('click', ()=>{
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

searchControl.addEventListener("keyup",function(e){
    if(e.keyCode == 13){
        e.preventDefault();
        searchBtn.click();
    }
})

function getMealList(){
    let searchInputText = document.getElementById("search-input").value.trim(); // delete spacing at the beginning and at the end to string value
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
    .then(response => response.json())
    .then(data =>{
        let html =""
        if(data.meals){
            data.meals.forEach(meal =>{
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="namnam" />
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="javascript:void(0)" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        }else{
            html = "Sorry, didn't find any meal or occurred an error the api";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML= html;
    }).catch(err =>{
        html= `${err}`
    })
}

function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>

    <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>

    <div class="recipe-meal-img">
        <img class="rounded-circle my-0 mx-auto d-block" src="${meal.strMealThumb}" width="100px" height="100px" alt="food">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch video</a>
    </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}