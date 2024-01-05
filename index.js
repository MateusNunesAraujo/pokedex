let contenedor = document.querySelector('.contenedor')
let modal = document.querySelector('.modal')
let cancelar = document.querySelector('.cancelar')
let cont_habilidades = document.querySelector('.habilidades')
let cont_habitad = document.querySelector('.cont-habitad')
let valor_est = document.querySelectorAll('.valor')
let buscador = document.querySelector('#buscador')
let btn_buscador = document.querySelector('#btn-buscador')
let buscando = false
let offset = 0; //Variable donde se establece la posicion donde se pide a la API traer a los pokemones
const limit = 20; //cantidad de pokemones que se le pide a la API traer 
let nro_pokemon = 0


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
        document.querySelector('#peso').textContent = `${data4.weight / 10}kg`
        document.querySelector('#altura').textContent = `${data4.height / 10}m`

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
            if (clase_pokemon.is_baby !== false) {
                document.querySelector('#is-baby').style.color = 'pink'
                document.querySelector('#is-baby').textContent = 'Bebé'
            } else {
                document.querySelector('#is-baby').textContent = ''
            }
            if (clase_pokemon.is_legendary !== false) {
                document.querySelector('#is-legendary').style.color = 'orange'
                document.querySelector('#is-legendary').textContent = 'Legendaria'
            } else {
                document.querySelector('#is-legendary').textContent = ''
            }
            if (clase_pokemon.is_mythical !== false) {
                document.querySelector('#is-mythical').style.color = '#740090'
                document.querySelector('#is-mythical').textContent = 'Mítica'
            } else {
                document.querySelector('#is-mythical').textContent = ''
            }

        })
        let habilidades = ''
        data4.abilities.forEach((element, i) => {
            fetch(element.ability.url).then(response => response.json()).then((data6) => {
                console.log(data6)
                let descripcionEs = data6.names.find(entry => entry.language.name === 'es');
                let flavor_text_entriesES = data6.flavor_text_entries.find(entry => entry.language.name === 'es')
                    habilidades += `<div class="contenedor-habilidades">
                                        <div class="nombre-habilidad">${descripcionEs.name }</div>
                                        <div class="descripcion-habilidad">${flavor_text_entriesES ? flavor_text_entriesES.flavor_text: 'Descripción no disponible'}</div>
                                    </div>`;
                    cont_habilidades.innerHTML = habilidades;
                
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

        /* Evoluciones */
        fetch(data4.species.url).then(response => response.json()).then((url_evoluciones) => {
            fetch(url_evoluciones.evolution_chain.url).then(response => response.json()).then((evoluciones) => {
                document.querySelector(".lista-evoluciones").innerHTML = ''
                let lista_evoluciones = document.querySelector(".lista-evoluciones")
                let template_evoluciones = ''
                /* Primera evolución */
                template_evoluciones += `
                    <div class="evolucion">
                        <img src="pokeball-evol.png" alt="">
                        <a href="https://pokeapi.co/api/v2/pokemon/${evoluciones.chain.species.name}/">${evoluciones.chain.species.name}</a>
                    </div>`

                evoluciones.chain.evolves_to.forEach(element => {
                    /* Segunda evolución */
                    template_evoluciones += `
                    <div class="evolucion">
                        <img src="pokeball-evol.png" alt="">
                        <a href="https://pokeapi.co/api/v2/pokemon/${element.species.name}/">${element.species.name}</a>
                    </div>`

                    /* Tercera evolución */
                    if (element.evolves_to.length !== 0) {
                        element.evolves_to.forEach(element2 => {
                            template_evoluciones += `
                            <div class="evolucion">
                                <img src="pokeball-evol.png" alt="">
                                <a href="https://pokeapi.co/api/v2/pokemon/${element2.species.name}/">${element2.species.name}</a>
                            </div>`
                        });
                    }

                })
                lista_evoluciones.innerHTML += template_evoluciones
                document.querySelectorAll('.evolucion a').forEach(element => {
                    element.addEventListener('click', (e) => {
                        e.preventDefault()
                        informacion_pokemon(e.target.getAttribute('href'))
                    })
                })
            })
        })

        /* --------------------------------------------------------------- */

        fetch(data4.location_area_encounters).then(response => response.json()).then((data7) => {
            let habitad = ''
            if (data7.length !== 0) {

                data7.forEach(element => {

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

                        document.querySelectorAll('.cont-otros-pokemones').forEach(element => {
                            element.addEventListener('click', (e) => {
                                e.preventDefault()
                                informacion_pokemon(e.target.getAttribute('href'))
                            })
                        })
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
    }).catch(error => {
        console.log('Aquí se esta manejando el error')
    })

}


function loadMorePokemons() {
    contenedor.classList.remove('contenedor-activado')
    buscando = false
    const url_api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    fetch(url_api)
        .then((response) => response.json())
        .then((data) => {
            data.results.forEach((element) => {

                fetch(element.url).then((response) => { return response.json() })
                    .then((data2) => {
                        fetch(data2.species.url).then((response) => { return response.json() })
                            .then((data3) => {

                                let tipo = '' //Intentar quitar los guiones para que no se vea feo
                                let inf = ''
                                data2.types.forEach(i => tipo += ' ' + i.type.name)
                                inf += `<div class="contendor-card">
                        <div class="card">
                            <div class="nombre-pokemon">${element.name}</div>
                            <div class="sub-info">
                                <div class="inf">${tipo}</div>
                                <div class="inf">${data3.habitat !== null ? data3.habitat.name : 'No hay habitad'}</div>
                            </div>
                            <div class="btn" url="${element.url}"><img class="btn-2" src="pokebola.png" alt=""></div>
                        </div>
                    </div>`

                                if (inf !== '') {
                                    contenedor.innerHTML += inf
                                    nro_pokemon += 1
                                    console.log(nro_pokemon)
                                } else {
                                    contenedor.innerHTML = `<h1>-SE ACABO LA LISTA DE POKEMONES-</h1>`
                                    return
                                }

                                for (let card of contenedor.children) {

                                    let contenedores = card.children
                                    for (let nombre of contenedores) {
                                        if (nombre.children[0] != undefined) {
                                            nombre.children[0].style.backgroundImage += `linear-gradient(45deg, ${data3.color.name}, transparent)` /* += data3.color.name */
                                        }
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
            });
        });

    offset += limit;
}

//Se llama a la función para cargar los primeros 20 pokemones 
loadMorePokemons();


//Eventos: ------

//Botón de cancelar:
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

//Botón para mostrar la parte trasera del pokemón:
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
            document.querySelector('.img-pokemon').src = url_back_default
            document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
        } else {
            document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
            let img_error = document.querySelector('.img-error')

            img_error.classList.add('img-error-activado')
            setTimeout(() => {
                img_error.classList.remove('img-error-activado')
            }, 2000);

        }
    } else {
        document.querySelector('.img-pokemon').setAttribute('segunda-imagen', url_front_default)
        let img_error = document.querySelector('.img-error')
        img_error.classList.add('img-error-activado')
        setTimeout(() => {
            img_error.classList.remove('img-error-activado')
        }, 2000);
    }
})


//Botón para mostrar informacion adicional del pokemon (peso altura)
document.querySelector('.inf-adicional').addEventListener('click', (e) => {
    if (document.querySelector('.cont-inf-adicional').classList.contains('mostrar-peso-altura')) {
        document.querySelector('.cont-inf-adicional').classList.remove('mostrar-peso-altura')
    } else {
        document.querySelector('.cont-inf-adicional').classList.add('mostrar-peso-altura')
    }
})


document.querySelector('.inf-adicional').addEventListener('click', (e) => {

    e.target.classList.add('inf-adicional-precionado')
    setTimeout(() => {
        e.target.classList.remove('inf-adicional-precionado')
    }, 100);

})

//Mostrar más 20 pokemones al momento de hacer scroll hasta la parte final del contenedor visible
/*  console.log(`Posición:${scrollPosition}-Altura del Scroll:${totalHeight}-Altura del contenedor:${windowHeight}`) */
contenedor.addEventListener('scroll', () => {
    let ventana_carga = document.querySelector('.ventana-cargando')
    const scrollPosition = contenedor.scrollTop;
    const totalHeight = contenedor.scrollHeight;
    const windowHeight = contenedor.clientHeight;
    if (buscando === false) {
        if (scrollPosition + windowHeight + 1 >= totalHeight) {
            loadMorePokemons(); //Aquí se pide otros 20 pokemones
            ventana_carga.classList.add('ventana-cargando-activado')
            buscador.disabled = true
            setTimeout(() => {
                buscador.disabled = false
                ventana_carga.classList.remove('ventana-cargando-activado')
            }, 2500);

        }
    }
});
btn_buscador.addEventListener('click', () => {
    buscando = true
    let valor_busqueda = buscador.value.trim();
    valor_busqueda = valor_busqueda.toLowerCase()
    valor_busqueda = valor_busqueda.replace(/ /g,"-")
    console.log(valor_busqueda)
    if (buscando) {
        contenedor.classList.remove('contenedor-activado')
        document.querySelector('.contenedor').innerHTML = ''
        contenedor.classList.add('contenedor-activado')
        fetch(`https://pokeapi.co/api/v2/pokemon/${valor_busqueda}/`).then(response => response.json()).then((resultado) => {
            fetch(resultado.species.url).then((response) => { return response.json() })
                .then((data3) => {
                    let tipo = '' //Intentar quitar los guiones para que no se vea feo
                    let inf = ''
                    resultado.types.forEach(i => tipo += ' ' + i.type.name)
                    inf += `<div class="contendor-card">
                        <div class="card">
                            <div class="nombre-pokemon">${resultado.name}</div>
                            <div class="sub-info">
                                <div class="inf">${tipo}</div>
                                <div class="inf">${data3.habitat !== null ? data3.habitat.name : 'No hay habitad'}</div>
                            </div>
                            <div class="btn" url="https://pokeapi.co/api/v2/pokemon/${valor_busqueda}/"><img class="btn-2" src="pokebola.png" alt=""></div>
                        </div>
                    </div>`
                    if (inf !== '') {
                        contenedor.innerHTML += inf
                        nro_pokemon += 1
                        console.log(nro_pokemon)
                    } else {
                        contenedor.innerHTML = `<h1>-SE ACABO LA LISTA DE POKEMONES-</h1>`
                        return
                    }
                    for (let card of contenedor.children) {

                        let contenedores = card.children
                        for (let nombre of contenedores) {
                            nombre.children[0].style.backgroundImage += `linear-gradient(45deg, ${data3.color.name}, transparent)` /* += data3.color.name */
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
                let mensaje_pikachu = `
    <div class="mensaje-pikachu">
        <div class="contenedor-mensaje-pikachu">
            <img class="pikachu" src="happy_cartoon_pikachu_pointing_at_an_invisible_s.png" alt="pikachu">
            <p>¡Aquí tienes al pokemón que estabas buscando!</p>
        </div>
    </div>`
    contenedor.innerHTML += mensaje_pikachu
                   

        }).catch(error => {
            contenedor.classList.add('contenedor-activado')
            contenedor.innerHTML = `
            <div id="sin-resultados">
                <img src="sin-resultados.png" alt=""> 
                <p>Sin resultados en su busqueda</p>
            </div>`

        })

        

    }

    
    

})
buscador.addEventListener('input', (e) => {
    buscando = true
    let valor_busqueda = e.target.value.trim();
    if (valor_busqueda === '') {
        contenedor.classList.remove('contenedor-activado')
        document.querySelector('.contenedor').innerHTML = ''
        loadMorePokemons()
    }
})
