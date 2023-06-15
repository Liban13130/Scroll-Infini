const imageList = document.querySelector('.img-list')
const errorMsg = document.querySelector(".error-msg")
let searchQuery = "random"
let pageIndex = 1

async function fetchData(){
    try {
        const response = await fetch(`https://api.unsplash.com/search/collections?page=${pageIndex}&per_page=30&query=${searchQuery}&client_id=dOOtOdZUFPptkLLG3_gErO9q4thWynhl7-TRUXV-XPk`)

        if(!response.ok){
            throw new Error(`Erreur : ${response.status}`)
        }

        const data = await response.json()

        if(!data.total){
            imageList.textContent = "";
            throw new Error("Oops, rien de tel dans notre base de données... Tentez un mot clés plus précis.")
        }
        console.log(data);
        createImages(data.results)



    } catch (error) {
        errorMsg.textContent = `${error}`
    }
}

fetchData()

function createImages(data){
    data.forEach(img => {
        const newImg = document.createElement("img");
        newImg.src = img.cover_photo.urls.small;
        imageList.appendChild(newImg)
    });
}

const observer = new IntersectionObserver(handleIntersect, {rootMargin: "50%"}) //Au lieu que le scroll infini charge en bas de page il chargera a 50% de la fenetre comme une marge de 50% plus haut

observer.observe(document.querySelector(".infinite-marker"))

function handleIntersect(entries){
    console.log(entries);
    if(window.scrollY > window.innerHeight && entries[0].isIntersecting){
        pageIndex++
        fetchData()
    }
}

const input = document.querySelector("#search")
const form = document.querySelector("form")

form.addEventListener("submit", handleSearch)

function handleSearch(e){
    e.preventDefault()

    imageList.textContent = "";

    if(!input.value){
        errorMsg.textContent = "L'objet de la recherche ne peut être vide."
        return
    }

    errorMsg.textContent = "";
    searchQuery = input.value
    pageIndex = 1
    fetchData()
}

const scrollToTop = document.querySelector(".scroll-to-top")

scrollToTop.addEventListener('click', pushToTop)

function pushToTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    }
        
    )
}