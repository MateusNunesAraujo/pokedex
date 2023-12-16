let contenedor = document.querySelector('.contenedor')
let modal = document.querySelector('.modal')


const url_api = "https://pokeapi.co/api/v2/pokemon?limit=20?limit=20&offset=20";
const demostracion = document.querySelector("#demostracion")
fetch(url_api).then((response) => { return response.json() })
    .then((data) => {
        let inf = ''
        data.results.forEach(element => {
            fetch(element.url).then((response) => { return response.json() })
                .then((data2) => {
                    fetch(data2.species.url).then((response)=> {return response.json()})
                    .then((data3) =>{
                        /* console.log(data3) */
                        let tipo = '' //Intentar quitar los guiones para que no se vea feo
                        let inf = ''
                        data2.types.forEach(i => tipo += ' ' + i.type.name)
                            inf += `<div class="contendor">
                            <div class="card">
                                <div class="nombre-pokemon">${element.name}</div>
                                <div class="sub-info">
                                    <div >${tipo}</div>
                                    <div>${data3.habitat.name}</div>
                                </div>
                                <div class="btn" url="${element.url}"><img class="btn-2" src="pokebola.png" alt=""></div>
                            </div>
                        </div>`
                    
                        contenedor.innerHTML += inf
                        let btn = document.querySelectorAll('.btn-2')
                        for (let index = 0; index < btn.length; index++) {
                            const element = btn[index];
                            element.addEventListener('click',(e)=>{
                                modal.classList.add('modal--show')
                            })
                            
                        }
                    
                    })
                    
                })
        })
    })


//modal



