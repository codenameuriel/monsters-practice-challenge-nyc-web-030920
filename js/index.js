document.addEventListener('DOMContentLoaded', () => {
    //render first 50 monsters 
    getMonsters(page)
    
    createForm()
    const form = document.querySelector('.create-monster-form')

    //pagination
    document.addEventListener('click', event => {
        if (event.target.id === 'forward') {
          if (containerDiv.childElementCount < 50) {
            alert('on the last page')
          } else {
            containerDiv.innerHTML = ''
            getMonsters(++page)
          }
        } else if (event.target.id === 'back')  {
          if (page === 1) {
            alert('can\'t go back from page 1')
          } else {
            containerDiv.innerHTML = ''
            getMonsters(--page)
          }
        } 
    })

    //toggle form view
    toggleFormBtn.addEventListener("click", function(event) {
      toggleForm()
    })

    //post new monster
    form.addEventListener('submit', event => {
      event.preventDefault()

      const newMonster = {
            name: form.name.value, 
            age: form.age.value, 
            description: form.description.value 
          }

      postMonster(newMonster);

      form.reset()

      toggleForm()
    })
})

const baseUrl = "http://localhost:3000/monsters"

//div that contains the form
const formDiv = document.getElementById(`create-monster`)
//set to display none as default to toggle view on button click
formDiv.style.display = 'none'

//div that contains the rendered monster li elements
const containerDiv = document.getElementById('monster-container')

//POST request headers object
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}

//button for showing form
const toggleFormBtn = document.createElement('button')
toggleFormBtn.textContent = 'Add a New Monster'

//inserting button before the form div
document.body.insertBefore(toggleFormBtn, formDiv)

//state variable to toggle form view
let viewForm = false

//used in pagination
let page = 1


function url(page) {
  return `http://localhost:3000/monsters/?_limit=50&_page=${page}`
}

//function to toggle form view
//changes div containing the form display.style
function toggleForm() {
  viewForm = !viewForm

  if (viewForm) {
    formDiv.style.display = 'block'
  } else {
    formDiv.style.display = 'none'
  }
}

function getMonsters(page) {
  fetch(url(page))
  .then(resp => resp.json())
  .then(monsters => {
    monsters.forEach(monsterObj => {
    renderMonster(monsterObj)
    });
  })
}

function renderMonster(monsterObj) {
  let innerDiv = document.createElement('div')
  innerDiv.dataset.id = monsterObj.id

  innerDiv.innerHTML = `
    <h1>${monsterObj.name}</h1>
    <p><b>Age: </b>${monsterObj.age}</p>
    <p><b>Description: </b>${monsterObj.description}</p>
    <hr>
  `
  containerDiv.append(innerDiv)
}

//function to post monster object to database
//renders pessimisticaly
function postMonster(newMonster) {
  fetch(baseUrl, {
    //const headers declared globally
    headers, 
    method: 'POST',
    body: JSON.stringify(newMonster)
  })
  .then(resp => resp.json())
  .then(monster => {
    renderMonster(monster)
  })
}


function createForm(){
  formDiv.innerHTML = `
  <h1>Create New Monster</h1>
  <form class = "create-monster-form">
    <p>
      Monster Name: <br>
      <input type="text" name="name" value="" placeholder="Enter  a monsters name" class="input-text"/>
    </p>
    
    <p>
      Monster Age: <br>
      <input type="number" name="age" value="" placeholder="Enter a monsters Age" class="input-text"/>
    </p>
    
    <p>
      Monster Description: <br>
      <input type="text" name="description" value=""   placeholder="Monster Description" class="input-text"/>
    </p>
    
    <input type="submit" name="submit" value="Create Monster" class="submit"/>
  </form>
  `
}
