let input = document.querySelector(".form__input")
input.addEventListener('change', deleteRepsIfEmptyInput)

let move

function findReps() {
    return new Promise((resolve, reject) => {
        let search = input.value
        let per_page = 5
        fetch(`https://api.github.com/search/repositories?q=${search}&per_page=${per_page}`)
            .then((promise) => promise.json())
            .then((reps) => resolve(reps))
            .catch((err) => reject(console.log(err)))
    })
}

function giveNewEventListener (reps) {
    deleteAllReps()
    let conAll = document.querySelector(".form__rep-container--all")
    conAll.removeEventListener("click", move)
    move = moveItem(reps)  
    conAll.addEventListener("click",  move)
    reps.items.forEach(el => renderReps(el))
}

function moveItem(reps) {
    let repos = reps
    return function (event) {
        let el = event.target
        if (el.tagName == "LI") {
            let fragment = document.createDocumentFragment()

            let list = document.querySelector(".form__rep-list--container")

            let cItem = document.createElement("li")

            fragment.appendChild(cItem)

            cItem.classList.add("form__rep-item--container")

            let cList = document.createElement("ul")
            cList.classList.add("form__rep-list", "form__rep-list--necessary")

            el.classList.remove("form__rep-item--all")
            el.classList.add("form__rep-item--necessary")
            
            let gitId = el.getAttribute("gitId")

            let rep = repos.items.find(rep => rep.id == gitId)

            let liOwner = document.createElement("li")
            let liStars = document.createElement("li")
            
            liOwner.classList.add("form__rep-item", "form__rep-item--necessary")
            liStars.classList.add("form__rep-item", "form__rep-item--necessary")

            el.textContent = `Name: ${rep.name}`
            liOwner.textContent = `Owner: ${rep.owner.login}`
            liStars.textContent = `Stars: ${rep.stargazers_count}`

            cList.appendChild(el)
            cList.appendChild(liOwner)
            cList.appendChild(liStars)

            cItem.appendChild(cList)
            
            let button = document.createElement("button")
            button.classList.add("form__rep-button")
            cItem.appendChild(button)
            
            list.appendChild(fragment)

            input.value = ""
            deleteAllReps()
        }
    }
}

function deleteAllReps() {
    let list = document.querySelector(".form__rep-list--all")
    while(list.firstChild) {
        list.removeChild(list.firstChild)
    }
}


function renderReps(el) {
    let list = document.querySelector(".form__rep-list--all")
    let item = document.createElement("li")
    item.setAttribute("gitId", el.id)
    item.classList.add("form__rep-item", "form__rep-item--all")
    item.textContent = el.name
    list.appendChild(item)
}

function deleteRepsIfEmptyInput() {
    let list = document.querySelector(".form__rep-list--all")
    if (input.value === "") {
        while(list.firstChild) {
            list.removeChild(list.firstChild)
        }
    }
}

function debounce(fn) {
    let interval
    return function() {
        clearTimeout(interval)
        interval = setTimeout(() => {
            let result = fn()
            result
            .then((reps) => giveNewEventListener(reps))
            .catch((err) => console.log(`Error : ${err}`))
        }, 800)
    }
}


input.addEventListener("keyup", debounce(findReps))

list = document.querySelector(".form__rep-list--container")
list.addEventListener("click",  deleteRep)

function deleteRep(event) {
    if (event.target.tagName === "BUTTON") {
        event.target.closest(".form__rep-item--container").remove()
    }
}
