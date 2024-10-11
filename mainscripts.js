// Load Categories

const load_categories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then((data) => display_categories(data.categories))
        .catch((error) => console.log(error));
};

// Display Categories

const display_categories = (data) => {
    const categoryContainer = document.getElementById("categories");
    data.forEach((item) => {
        const button = document.createElement("button");
        button.classList = "btn w-[150px] md:w-[250px] lg:w-[250px]";
        button.innerHTML = `<img class=" h-9"
         src="${item.category_icon}"/>
        <h6 class="font-medium text-lg">${item.category}</h6>`;
        button.onclick = () => {
            loadCategoriesPets(item.category);
            removeActiveB();
            button.classList.add("active");
        }
        categoryContainer.append(button);
    })
}

// Remove Active Buttons
const removeActiveB = () => {
    const buttons = document.getElementsByClassName("btn");
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
}

//view more button
const navigateToSection = () => {
    const section = document.getElementById("main");
    section.scrollIntoView({ behavior: 'smooth' });
};

// Load all list of pets
const loadAllPets = () => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
        .then((res) => res.json())
        .then((data) => displayPetsList(data.pets))
        .catch((error) => console.log(error));

}


//  Sorting by price
const sortPets = () => {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.remove("hidden");
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = '';
    fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
        .then((res) => res.json())
        .then((data) => {
            const pets = data.pets.sort((a, b) => {
                if (!a.price) return 1;
                if (!b.price) return -1;
                return b.price - a.price;
            });
            setTimeout(() => {
                displayPetsList(pets);
                loadingSpinner.classList.add("hidden");
            }, 2000);

        })
        .catch((error) => {
            console.log(error);
            loadingSpinner.classList.add("hidden");
        });
};


// Display all Pets
const displayPetsList = (data) => {
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = '';
    const head = document.getElementById("head");

    if (data.length == 0) {
        petContainer.classList.remove('grid');
        head.classList.add("hidden");

        petContainer.innerHTML = `<div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="images/no-data.png" alt="">
        <h2 class="text-center text-xl font-bold">"No Content Here in this category"</h2>
    </div>`;
        return
    }
    else {
        head.classList.remove("hidden");
        petContainer.classList.add("grid");
    }


    data.forEach((item) => {
        const card = document.createElement("div");
        card.classList = "card bg-base-100 w-66 lg:w-86 shadow-xl"
        card.innerHTML = `
            <figure class="px-6 pt-2">
                <img src="${item.image}" alt="pets"
                    class="rounded-xl w-auto" />
            </figure>
            <div class="card-body  text-center">
                <h2 class="card-title px-2">${item.pet_name}</h2>

                <div class=" flex  flex-col justify-start
                px-2 gap-4 ">
                    <div class="flex flex-row gap-3 ">
                        <img class="h-7" src="https://img.icons8.com/?size=100&id=ks8n9dBGaAaw&format=png&color=000000"
                            alt="">
                        <div>    
                        <span> Breed : </span> <span>${item.breed ? item.breed : 'Not available'} </span>
                        </div>
                    </div>

                  <div class="flex flex-row gap-3">
    <img class="h-7" src="https://img.icons8.com/?size=100&id=85102&format=png&color=000000" alt="">
    <div>
     <span>Birth:</span>  <span>${item.date_of_birth ? item.date_of_birth : 'Not available'}</span>
     </div>
</div>
<div class="flex flex-row gap-3">
    <img class="h-7" src="https://img.icons8.com/?size=100&id=DN2eJOO2sKEe&format=png&color=000000" alt="">
    <div>
    <span> Gender: </span> <span>${item.gender ? item.gender : 'Not available'}</span></div>
</div>

                    <div class="flex flex-row gap-3">
                        <img class="h-7" src="https://img.icons8.com/?size=100&id=16511&format=png&color=000000" alt="">
                        <div>
                        <span>price:</span> </span>$ ${item.price ? item.price : 'Not Available'}</span></div>
                    </div>
                </div>

                <div class="h-0.5 bg-slate-400 ">

                </div>
                <div class=" flex flex-row lg:gap-4 md:gap-0.5 gap-0.5 justify-center">
                    <button onclick="showPic('${item.image}')" class="btn btn-sm">
                        <img class="h-7" src="https://img.icons8.com/?size=100&id=zU5TYzmzXYRC&format=png&color=000000"
                            alt="">
                    </button>
                    <button class="btn btn-sm"  onclick="disableButton(this)">Adopt</button>
                    <button onclick="loadDetails('${item.petId}')" class="btn btn-sm  bg-green-200">Details
    </button>
                </div>
            </div>`
        petContainer.append(card);
    })
}

//showing pet details
const loadDetails = async (petId) => {
    console.log(petId);
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.petData);
};

// disable function
const disableButton = (button) => {
    const modal = document.getElementById("countDownModal");
    const count = document.getElementById("countdownTimer");
    let counter = 3;
    count.style.setProperty("--value", counter);

    modal.showModal();
    const interval = setInterval(() => {
        counter--;
        count.style.setProperty('--value', counter);
        if (counter <= 0) {
            clearInterval(interval);
            modal.close();
        }

        // loadingSpinner.classList.add("hidden");
    }, 1000);


    button.disabled = true;
    button.classList.add("btn-disabled");
}



//showing details 
const displayDetails = (petData) => {
    console.log(petData);
    const details = document.getElementById("modal-content");
    details.innerHTML =
        `<div class="w-11/12 py-4 mx-auto gap-6">
                        
                        <div class="rounded-xl overflow-hidden w-full h-full">
                           <img class="object-cover w-full h-full" src="${petData.image}" alt="">
                        </div>
                        <div class="w-11/12 mx-auto gap-3 flex justify-start flex-col">
                            <h2 class="font-extrabold text-xl py-6 ">${petData.pet_name}</h2>
                            <div>

                                <div class=" grid grid-cols-2 justify-start
                 gap-4 ">
                                    <div class="flex flex-row gap-2 ">
                                        <img class="h-7"
                                            src="https://img.icons8.com/?size=100&id=ks8n9dBGaAaw&format=png&color=000000"
                                            alt="">
                                       <span> Breed: </span> ${petData.breed ? petData.breed : 'Not available'}
                                    </div>

                                    <div class="flex flex-row gap-2">
                                        <img class="h-7"
                                            src="https://img.icons8.com/?size=100&id=85102&format=png&color=000000"
                                            alt="">
                                       <span>  Birth: </span> ${petData.date_of_birth ? petData.date_of_birth : 'Not available'}
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <img class="h-7"
                                            src="https://img.icons8.com/?size=100&id=DN2eJOO2sKEe&format=png&color=000000"
                                            alt="">
                                        <span > Gender: </span> ${petData.gender ? petData.gender : 'Not available'}
                                    </div>

                                    <div class="flex flex-row gap-2">
                                        <img class="h-7"
                                            src="https://img.icons8.com/?size=100&id=16511&format=png&color=000000"
                                            alt="">
                                        <span > price: </span> $  ${petData.price ? petData.price : 'Not Available'}
                                    </div>

                                    <div class="flex flex-row gap-2 col-span-2">
                                        <img class="h-7"
                                            src="https://img.icons8.com/?size=100&id=DN2eJOO2sKEe&format=png&color=000000"
                                            alt="">
                                        <span> Vaccinated status: </span> ${petData.vaccinated_status ? petData.vaccinated_status : 'Not Available'}
                                    </div >

                                </div >

                            </div >
                        </div >
                        <div class="bg-slate-400 h-0.5 mt-3 w-11/12 mx-auto "></div>
                        <div class="w-11/12 mx-auto gap-4">
                            <h2 class=" font-bold text-xl py-4">Details Information</h2>
                            <p>${petData.pet_details}</p>
                        </div>
                    </div >
    `
    document.getElementById("customModal").showModal();
}



// show Image in side section
const showPic = (pic) => {
    console.log(pic);
    const id = document.getElementById("showImage");
    const cardDiv = document.createElement("div");
    cardDiv.classList = " lg:w-[145px] w-[60px] h-[60px] md:w-[135px] md:h-[135px] lg:h-[120px] lg:p-3 md:p-2 p-1 rounded-lg border-2 border-cyan-200 mb-4 ";
    const card = document.createElement("div");
    card.classList = "w-full h-full flex justify-center items-center overflow-hidden";
    card.innerHTML = `<img class="rounded-lg object-cover w-full h-full" src="${pic}" alt="">`;
    cardDiv.append(card);
    id.append(cardDiv);
};



// loading items category-wise

const loadCategoriesPets = (id) => {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.remove("hidden");
    // console.log(id)
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = '';
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${id.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
            setTimeout(() => {
                displayPetsList(data.data);
                loadingSpinner.classList.add("hidden");
            }, 2000);
        })
        .catch((error) => {
            console.log(error);
            loadingSpinner.classList.add("hidden");
        });
};


load_categories();
loadAllPets();