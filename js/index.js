  
let initialize = async () => {
        
    let homeTag = document.querySelector('#homePage')
    let dogTag = document.querySelector('#dogPage')
    let catTag = document.querySelector('#catPage')
    let enquireTag = document.querySelector('#enquirePage')
    let homePage = document.querySelector('#homeDiv')
    let dogPage = document.querySelector('#dogDiv')
    let catPage = document.querySelector('#catDiv')
    let enquirePage = document.querySelector('#enquireDiv')
    let currentPage = homePage;
    let currentTag = homeTag;
    let dogNames = await retrieveDogNames();
    let catObjs = await retrieveCats();
    let catNames = catObjs.map((cat) => cat.name);
    let isFirstCatRender = false;
    let isFirstDogRender = false;
    let previousCatImages = [];

 
//NAV BAR PAGE LOADING// 

    function loadNewPage (page, tag) {
        currentPage.hidden = true;
        page.removeAttribute('hidden');
        currentPage = page;
        currentTag.classList.remove('active');
        tag.classList.add('active');
        currentTag = tag;
        }
    
    homeTag.addEventListener('click', (e) => {
        e.preventDefault();
        loadNewPage(homePage, homeTag)
    })
    
    dogTag.addEventListener('click', (e) => {
    e.preventDefault();
        loadNewPage(dogPage, dogTag)
        if (!isFirstDogRender) {
            createAnimalCard('#adoptDogDiv', changeDogImg, dogNames);
            isFirstDogRender = true;
        }
    })

    catTag.addEventListener('click', (e) => {
        e.preventDefault();
        loadNewPage(catPage, catTag)
        if (!isFirstCatRender) {
            createAnimalCard('#adoptCatDiv', changeCatImg, catNames);
            isFirstCatRender = true;
        }
    })

    enquireTag.addEventListener('click', (e) => {
        e.preventDefault();
        loadNewPage(enquirePage, enquireTag)
    })

//HOME CARD PAGE LOADING//

    let dogImg = document.querySelector('#dogImg')
    let catImg = document.querySelector('#catImg')
    dogImg.addEventListener('mouseover', () => {
        dogImg.src = './images/adopt-puppies.webp'
    })
    dogImg.addEventListener('mouseout', () => {
        dogImg.src = './images/adopt-dog.jpeg'
    })
    catImg.addEventListener('mouseover', () => {
        catImg.src = './images/adopt-cat2.jpeg'
    })
    catImg.addEventListener('mouseout', () => {
        catImg.src = './images/adopt-cat.webp'
    })

    let dogCard = document.querySelector('#dogCard')
    let catCard = document.querySelector('#catCard')
    
    dogCard.style.cursor = "pointer";
    catCard.style.cursor = "pointer";
    
    dogCard.addEventListener('click', () => {
        loadNewPage(dogPage, dogTag)
        if (!isFirstDogRender) {
            createAnimalCard('#adoptDogDiv', changeDogImg, dogNames);
            isFirstDogRender = true;
        }
    })
    
    catCard.addEventListener('click', () => {
        loadNewPage(catPage, catTag)
        if (!isFirstCatRender) {
            createAnimalCard('#adoptCatDiv', changeCatImg, catNames);
            isFirstCatRender = true;
        }
    })
    
    let loadingDiv = document.createElement('div')

    function getRandomMultipleOfFifty(min, max) {
        return( min + Math.floor( Math.random() * ( max-min+1 ) ) );
    }
    
    //DOG API & CAT DB//
    let createAnimalCard = async (div, imgFunc, names) => {
        let previousAnimalNames = [];

        for (let i = 0; i < 6; i++) {
            let adoptAnimalImg = document.createElement('div');
            let adoptAnimalDiv = document.querySelector(div);
            adoptAnimalDiv.appendChild(adoptAnimalImg);
            
            loadingDiv.setAttribute('id', 'loading')
            adoptAnimalImg.appendChild(loadingDiv)
            displayLoading()

            let fee = getRandomMultipleOfFifty(2, 6) * 50;
            
            let randomNumber = Math.floor(Math.random() * names.length);
            while (previousAnimalNames.includes(randomNumber)) {
                randomNumber = Math.floor(Math.random() * names.length);
            }
            previousAnimalNames.push(randomNumber);
            let name = names[randomNumber];
            let img = await imgFunc()
            adoptAnimalImg.innerHTML = 
            `<div class="col">
            <div class="card">
            <img src=${img} class="card-img-top" alt="...">
            <div class="card-body">
            <h5 id="${name}" class="card-title">${name}</h5>
            <p id="fee" class="card-text">Fee: $${fee}</p>
            <a href="#" id=${i.toString() + 'adopt' + div} class="btn btn-primary">Adopt Me!</a>
            <a href="#" id=${i.toString() + 'enquire' + div} class="btn btn-primary enquire">Enquire</a>
            </div>
            </div>
            </div>`
            hideLoading();

            let enquireBtn = document.getElementById(`${i.toString() + 'enquire' + div}`)
            let adoptMeBtn = document.getElementById(`${i.toString() + 'adopt' + div}`);
            
            enquireBtn.addEventListener('click', () => {  
                loadNewPage(enquirePage, enquireTag)
            })
            
            adoptMeBtn.addEventListener('click', (e) => {
                let animalCard = e.target.parentNode.parentNode
                let adoptedMessage = document.createElement('p')
                adoptedMessage.innerText = `${name} has been adopted.`
                animalCard.appendChild(adoptedMessage);
                animalCard.classList.add('adopted');
                
                let animalName = e.target.previousElementSibling.previousElementSibling.id;
                
                if (adoptMeBtn.id.includes('adoptDogDiv')) {
                    alert('Congratulations on your new pup!')
                    
                    fetch('http://localhost:3001/adoptedDogs', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            accept: 'application/json'
                        },
                        body: JSON.stringify({
                            name: animalName,
                        })
                    })
                    .then (resp => resp.json())
                    adoptMeBtn.remove();
                    enquireBtn.remove();
                }
                if (adoptMeBtn.id.includes('adoptCatDiv')) {
                    alert('Congratulations on your new cat!')

                    fetch('http://localhost:3001/adoptedCats', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            accept: 'application/json'
                        },
                        body: JSON.stringify({
                            name: animalName,
                        })
                    })
                    .then (resp => resp.json())
                    adoptMeBtn.remove();
                    enquireBtn.remove();
                }
            })
        }}
        
        
        function changeDogImg() {
            return fetch('https://dog.ceo/api/breeds/image/random')
            .then (resp => resp.json())
            .then (dogImg => {
                return dogImg.message;
            }
            )
        }
        
        function retrieveDogNames() {
            return fetch(`http://localhost:3001/dogNames`)
            .then (resp => resp.json())
            .then (names => {
                return names
            })
        }

        
        function retrieveCats() {
            return fetch('http://localhost:3001/catNames')
            .then (resp => resp.json())
            .then (cats => {
                return cats;
            })
        }

        function changeCatImg() {
            let random = Math.floor(Math.random() * catObjs.length)
            while (previousCatImages.includes(random)) {
                random = Math.floor(Math.random() * catObjs.length)
            }
            previousCatImages.push(random)
            return catObjs[random].image;
        }
     
    //LOADING SPIN FOR DOG PAGE//

    function displayLoading() {
        loadingDiv.classList.add("display");
    }

    function hideLoading() {
        loadingDiv.classList.remove('display');
    }

    //ENQUIRE SUBMISSIONS//
    let form = document.querySelector('#enquiryForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let userMessage = document.querySelector("#floatingTextarea2").value;
        let userEmail = document.querySelector("#floatingInput").value;
        
        let response = document.createElement('p');
        response.innerHTML = "</br>Your enquiry has been successfully submitted.";
        response.setAttribute('id', 'submitResponse')
        form.appendChild(response);
        
        fetch('http://localhost:3000/submissions', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                message: userMessage,
            })
        })
        .then(resp => resp.json())
        .then(json => console.log(json));
        form.reset();
    } )
 
}
document.addEventListener('DOMContentLoaded', initialize)
