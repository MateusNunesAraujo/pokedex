let contenedor = document.querySelector('.contenedor')
let modal = document.querySelector('.modal')
let cancelar = document.querySelector('.cancelar')
let cont_habilidades = document.querySelector('.habilidades')
let cont_habitad = document.querySelector('.cont-habitad')
let valor_est = document.querySelectorAll('.valor')


/* ------------ */
// Actualiza las barras de estadísticas con los valores proporcionados
function updateStats(valor, key) {
    const bar = document.getElementById(`${key}-bar`);
    const fillPercentage = (valor / 100) * 100; // Ajusta según el rango de valores de tus estadísticas
    const valor_cont = document.getElementById(`valor-${key}`);
    valor_cont.textContent = valor
    bar.style.width = `${fillPercentage}%`;
}

/* ------------- */

function informacion_pokemon(url) {
    fetch(url).then(response => response.json()).then((data4) => {
        console.log(data4)
        let imagen_pokemon = document.querySelector('.img-pokemon')
        imagen_pokemon.src = data4.sprites.front_default
        imagen_pokemon.setAttribute('segunda-imagen', data4.sprites.back_default)
        document.querySelector('#nombre-pokemon').textContent = data4.name
        document.querySelector('#number-pokedex').textContent = `#${data4.id}`
        document.querySelector('#peso').textContent = `${data4.weight/10}kg`
        document.querySelector('#altura').textContent = `${data4.height/10}m`
        
        /* Agregar clase del pokemon */
        fetch(data4.species.url).then(response => response.json()).then((data5) => {
            if (data5.flavor_text_entries.length !== 0) {
                data5.flavor_text_entries.forEach((nombre) => {
                    if (nombre.language.name == 'es') {

                        document.querySelector('.descripcion').textContent = nombre.flavor_text
                    }
                })
            } else {
                document.querySelector('.descripcion').textContent = 'No hay información acerca de este pokemon'
            }
        })
        fetch(data4.species.url).then(response => response.json()).then(clase_pokemon => {

            console.log(clase_pokemon)


            if (clase_pokemon.is_baby !== false) {
                document.querySelector('#is-baby').style.color = 'green'
                document.querySelector('#is-baby').textContent = 'Bebe:SI'
            } else {
                document.querySelector('#is-baby').style.color = 'black'
                document.querySelector('#is-baby').textContent = 'Bebe:NO'
            }
            if (clase_pokemon.is_legendary !== false) {
                document.querySelector('#is-legendary').style.color = 'green'
                document.querySelector('#is-legendary').textContent = 'Legendaria:SI'
            } else {
                document.querySelector('#is-legendary').style.color = 'black'
                document.querySelector('#is-legendary').textContent = 'Legendaria:NO'
            }
            if (clase_pokemon.is_mythical !== false) {
                document.querySelector('#is-mythical').style.color = 'green'
                document.querySelector('#is-mythical').textContent = 'Mitica:SI'
            } else {
                document.querySelector('#is-mythical').style.color = 'black'
                document.querySelector('#is-mythical').textContent = 'Mitica:NO'
            }

        })
        let habilidades = ''
        data4.moves.forEach((element, i) => {
            fetch(element.move.url).then(response => response.json()).then((data6) => {
                if (i <= 3) {
                    let descripcionEs = data6.flavor_text_entries.find(entry => entry.language.name === 'es');
                    habilidades += `<div class="contenedor-habilidades">
                                        <div class="nombre-habilidad">${data6.names[5].name}</div>
                                        <div class="poder-tipo">
                                            <div class="categoria-move">${data6.type.name}</div>
                                        </div>
                                        <div class="descripcion-habilidad">${descripcionEs ? descripcionEs.flavor_text : 'Descripción no disponible'}</div>
                                    </div>`;
                    cont_habilidades.innerHTML = habilidades;
                }
            });
        });
        data4.stats.forEach((i) => {
            switch (i.stat.name) {
                case 'hp':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                case 'attack':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                case 'defense':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                case 'special-attack':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                case 'special-defense':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                case 'speed':
                    updateStats(i.base_stat, i.stat.name)
                    break;
                default:
                    break;
            }
        })
        fetch(data4.location_area_encounters).then(response => response.json()).then((data7) => {
            let habitad = ''
            if (data7.length !== 0) {

                data7.forEach((element, index) => {

                    let pokemones = ''
                    fetch(element.location_area.url).then(response => response.json()).then((inf_habitad) => {

                        inf_habitad.pokemon_encounters.forEach(element2 => {

                            //Seguir aquí...  
                            pokemones += `<div class="cont-otros-pokemones">
                        <img class="icono-otros-pokemones" src="pokebola.png">
                         <a href="${element2.pokemon.url}">${element2.pokemon.name}</a>
                     </div>`


                        })

                        habitad += `
                <div class="descripcion-habitad">
                    <div class="contenedor-descripcion-habitad">
                        <div class="title-habitad">
                            <div>${inf_habitad.names[0].name}</div>
                            <div>Otros pokemones que se encuentrán aquí</div>
                        </div>
                        <div class="otros-pokemones">
                            ${pokemones}
                    </div>
                </div>`
                        cont_habitad.innerHTML = habitad
                    })

                })
            } else {
                habitad += `
                <div class="descripcion-habitad">
                    <div class="contenedor-descripcion-habitad">
                        <div class="title-habitad">
                            <h2>Sin resultados</h2>
                            <div>No se encuentra habitads de este pokemón. Probablemente se trate de una evolución</div>
                        </div>
                        <div class="otros-pokemones">
                            
                    </div>
                </div>`
                cont_habitad.innerHTML = habitad
            }
        })
    })

}

const url_api = "https://pokeapi.co/api/v2/pokemon?limit=600?limit=600&offset=0";
const demostracion = document.querySelector("#demostracion")
fetch(url_api).then((response) => { return response.json() })
    .then((data) => {
        data.results.forEach(element => {
            fetch(element.url).then((response) => { return response.json() })
                .then((data2) => {
                    fetch(data2.species.url).then((response) => { return response.json() })
                        .then((data3) => {
                            let tipo = '' //Intentar quitar los guiones para que no se vea feo
                            let inf = ''
                            data2.types.forEach(i => tipo += ' ' + i.type.name)
                            inf += `<div class="contendor">
                            <div class="card">
                                <div class="nombre-pokemon">${element.name}</div>
                                <div class="sub-info">
                                    <div class="inf">${tipo}</div>
                                    <div class="inf">${data3.habitat !== null ? data3.habitat.name : 'No hay habitad'}</div>
                                </div>
                                <div class="btn" url="${element.url}"><img class="btn-2" src="pokebola.png" alt=""></div>
                            </div>
                        </div>`

                            contenedor.innerHTML += inf
                            for (let card of contenedor.children) {

                                let contenedores = card.children
                                for (let nombre of contenedores) {
                                    nombre.children[0].style.backgroundImage += `linear-gradient(45deg, ${ data3.color.name}, transparent)` /* += data3.color.name */
                                }
                            }
                            let btn = document.querySelectorAll('.btn-2')
                            for (let index = 0; index < btn.length; index++) {
                                const element = btn[index];
                                element.addEventListener('click', (e) => {
                                    e.target.classList.add('btn-precionado')
                                    e.target.src = 'pokebola-abierta.png'
                                    setTimeout(() => {

                                        e.target.classList.remove('btn-precionado')
                                    }, 100);
                                    modal.classList.add('modal--show')
                                })

                            }

                            for (let element of btn) {
                                element.addEventListener('click', (e) => {
                                    let url = e.target.parentElement.getAttribute('url')
                                    informacion_pokemon(url)
                                })
                            }

                        })

                })
        })
    })

cancelar.addEventListener('click', (e) => {

    modal.classList.remove('modal--show')
    e.target.classList.add('cancelar-precionado')
    setTimeout(() => {
        e.target.classList.remove('cancelar-precionado')
    }, 100);
    document.querySelectorAll('.btn-2').forEach(element => {
        element.src = 'pokebola.png'
    })

})

document.querySelector('.default-back').addEventListener('click', (e) => {
    let url_front_default = document.querySelector('.img-pokemon').src
    let url_back_default = document.querySelector('.img-pokemon').getAttribute('segunda-imagen')

//Arreglar validacion para ver cuando un pokemon no tiene imagen de frente
    
    e.target.classList.add('default-back-precionado')
    setTimeout(() => {
        e.target.classList.remove('default-back-precionado')
    }, 100);
    if (url_back_default !== url_front_default) {
        if (url_back_default !== 'null') {
            console.log('uno')
            document.querySelector('.img-pokemon').src = url_back_default
            document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
        } else {
            document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
            let img_error = document.querySelector('.img-error')
            console.log('dos')

            img_error.classList.add('img-error-activado')
            setTimeout(() => {
                img_error.classList.remove('img-error-activado')
            }, 2000);

        }
    }else{
        document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
        let img_error = document.querySelector('.img-error')
        console.log('dos')

        img_error.classList.add('img-error-activado')
        setTimeout(() => {
            img_error.classList.remove('img-error-activado')
        }, 2000);
    }


})

document.querySelector('.inf-adicional').addEventListener('click',(e)=>{
    if(document.querySelector('.cont-inf-adicional').classList.contains('mostrar-peso-altura')){
        document.querySelector('.cont-inf-adicional').classList.remove('mostrar-peso-altura')
    }else{
    document.querySelector('.cont-inf-adicional').classList.add('mostrar-peso-altura')
    }
})


document.querySelector('.inf-adicional').addEventListener('click',(e)=>{

    e.target.classList.add('inf-adicional-precionado')
    setTimeout(() => {
        e.target.classList.remove('inf-adicional-precionado')
    }, 100);

})


