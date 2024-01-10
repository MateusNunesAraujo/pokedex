let contenedor = document.querySelector('.contenedor')
let modal = document.querySelector('.modal')
let cancelar = document.querySelector('.cancelar')
let cont_habilidades = document.querySelector('.habilidades')
let cont_habitad = document.querySelector('.cont-habitad')
let valor_est = document.querySelectorAll('.valor')
let buscador = document.querySelector('#buscador')
let btn_buscador = document.querySelector('#btn-buscador')
let btn_favoritos_guardados = document.querySelector('.favorito-guardados')
let btn_about_me = document.querySelector('#about-me')
let footer = document.querySelector('footer')
let buscando = false
let favorito = document.getElementsByClassName('favorito')
let offset = 0; //Variable donde se establece la posicion donde se pide a la API traer a los pokemones
const limit = 20; //cantidad de pokemones que se le pide a la API traer 
let nro_pokemon = 0

function cargando() {
    let ventana_carga = document.querySelector('.ventana-cargando')
    ventana_carga.classList.add('ventana-cargando-activado')
    document.querySelector('.favorito-guardados').style.pointerEvents = 'none'
    setTimeout(() => {
        buscador.disabled = false
        document.querySelector('.favorito-guardados').style.pointerEvents = 'fill'
        ventana_carga.classList.remove('ventana-cargando-activado')
    }, 2500);
}

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
                let descripcionEs = data6.names.find(entry => entry.language.name === 'es');
                let flavor_text_entriesES = data6.flavor_text_entries.find(entry => entry.language.name === 'es')
                habilidades += `<div class="contenedor-habilidades">
                                        <div class="nombre-habilidad">${descripcionEs.name}</div>
                                        <div class="descripcion-habilidad">${flavor_text_entriesES ? flavor_text_entriesES.flavor_text : 'Descripción no disponible'}</div>
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

        fetch(data4.species.url).then(response => response.json()).then(data_variantes => {
            console.log(data_variantes)
            let variantes = ''

            data_variantes.varieties.forEach(element => {
                variantes += `
            <div class="variante">
                <img src="variantes.png" alt="">
                <a href="${element.pokemon.url}">${element.pokemon.name}</a>
            </div>`
            })
            document.querySelector('.lista-variantes').innerHTML = variantes
            document.querySelectorAll('.variante').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault()
                    informacion_pokemon(e.target.getAttribute('href'))
                })
            })


        })

    }).catch(error => {
        console.log('Aquí se esta manejando el error')
    })

}


function loadMorePokemons() {
    cargando()
    const encabezado_eliminar = document.querySelector('.encabezado')
    if (encabezado_eliminar) {
        encabezado_eliminar.remove()
    }
    contenedor.classList.remove('contenedor-activado')
    buscando = false
    const url_api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    fetch(url_api)
        .then((response) => response.json())
        .then((data) => {
            data.results.forEach((element, index) => {

                fetch(element.url).then((response) => { return response.json() })
                    .then((data2) => {
                        fetch(data2.species.url).then((response) => { return response.json() })
                            .then((data3) => {
                                let pokemon_favoritoDATA = JSON.parse(localStorage.getItem('pokemon'))
                                let pokemon_favorito_comprobacion = {}

                                for (const key in pokemon_favoritoDATA) {

                                    if (element.name === key) {
                                        pokemon_favorito_comprobacion[element.name] = element.name
                                    }
                                }

                                let tipo = '' //Intentar quitar los guiones para que no se vea feo
                                let inf = ''

                                data2.types.forEach(i => tipo += ' ' + i.type.name)
                                inf += `<div class="contendor-card">
                        <div class="card">
                            <div class="nombre-pokemon">
                                ${element.name}
                            <img class="favorito" pokemon-name="${element.name}" src=${pokemon_favorito_comprobacion[element.name] ? 'favorito-agregado.png' : 'favorito.png'} alt=""></div>
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
                                for (const iterator of favorito) {
                                    iterator.addEventListener('click', (e) => {
                                        const pokemonName = e.target.getAttribute('pokemon-name');
                                        let storedData = JSON.parse(localStorage.getItem('pokemon')) || {};

                                        // Verifica si el pokemon ya está en el objeto almacenado
                                        if (storedData[pokemonName]) {
                                            // Si está, elimínalo del objeto
                                            delete storedData[pokemonName];
                                            e.target.src = 'favorito.png';
                                        } else {
                                            // Si no está, agrégalo al objeto
                                            storedData[pokemonName] = { name: pokemonName, url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/` };
                                            e.target.src = 'favorito-agregado.png';
                                        }

                                        // Guarda el objeto actualizado en el localStorage
                                        localStorage.setItem('pokemon', JSON.stringify(storedData));

                                    }
                                    )
                                }

                            })


                    })
            });
        }).catch(error => {
            let sin_conexion = `
            <div class="sin_conexion">
                <p>Sin conexión a internet</p>
            </div>`/* Mensaje de sí no hay internet */
            contenedor.innerHTML = sin_conexion

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
    const scrollPosition = contenedor.scrollTop;
    const totalHeight = contenedor.scrollHeight;
    const windowHeight = contenedor.clientHeight;
    if (buscando === false) {
        if (scrollPosition + windowHeight + 1 >= totalHeight) {
            loadMorePokemons(); //Aquí se pide otros 20 pokemones
        }

    }

});


btn_buscador.addEventListener('click', (e) => {
    buscando = true
    e.target.classList.add('btn-buscador-activado')
    setTimeout(() => {
        e.target.classList.remove('btn-buscador-activado')
    }, 100);
    const encabezado_eliminar = document.querySelector('.encabezado')
    if (encabezado_eliminar) {
        encabezado_eliminar.remove()
    }
    let valor_busqueda = buscador.value.trim();
    valor_busqueda = valor_busqueda.toLowerCase()
    valor_busqueda = valor_busqueda.replace(/ /g, "-")
    if (buscando && valor_busqueda !== '') {
        contenedor.classList.remove('contenedor-activado')
        document.querySelector('.contenedor').innerHTML = ''
        contenedor.classList.add('contenedor-activado')
        fetch(`https://pokeapi.co/api/v2/pokemon/${valor_busqueda}/`).then(response => response.json()).then((resultado) => {
            fetch(resultado.species.url).then((response) => { return response.json() })
                .then((data3) => {
                    const mensaje_cargando = document.querySelector('.mensaje-cargando')
                    if (mensaje_cargando) {
                        mensaje_cargando.remove()
                    }
                    let pokemon_favoritoDATA = JSON.parse(localStorage.getItem('pokemon'))
                    let pokemon_favorito_comprobacion = {}

                    for (const key in pokemon_favoritoDATA) {

                        if (resultado.name === key) {
                            pokemon_favorito_comprobacion[resultado.name] = resultado.name
                        }
                    }

                    let tipo = '' //Intentar quitar los guiones para que no se vea feo
                    let inf = ''

                    resultado.types.forEach(i => tipo += ' ' + i.type.name)
                    inf += `<div class="contendor-card">
            <div class="card">
                <div class="nombre-pokemon">
                    ${resultado.name}
                <img class="favorito" pokemon-name="${resultado.name}" src=${pokemon_favorito_comprobacion[resultado.name] ? 'favorito-agregado.png' : 'favorito.png'} alt=""></div>
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
                    for (const iterator of favorito) {
                        iterator.addEventListener('click', (e) => {
                            const pokemonName = e.target.getAttribute('pokemon-name');
                            let storedData = JSON.parse(localStorage.getItem('pokemon')) || {};

                            // Verifica si el pokemon ya está en el objeto almacenado
                            if (storedData[pokemonName]) {
                                // Si está, elimínalo del objeto
                                delete storedData[pokemonName];
                                e.target.src = 'favorito.png';
                            } else {
                                // Si no está, agrégalo al objeto
                                storedData[pokemonName] = { name: pokemonName, url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/` };
                                e.target.src = 'favorito-agregado.png';
                            }

                            // Guarda el objeto actualizado en el localStorage
                            localStorage.setItem('pokemon', JSON.stringify(storedData));

                        }
                        )
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
        let mensaje_cargando = `
        <div class="mensaje-cargando">
            <img src="pikachu_corriendo.gif" alt="">
            <p>Cargando...</p>
        </div>
        `
        contenedor.innerHTML = mensaje_cargando
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

btn_favoritos_guardados.addEventListener('click', (e) => {
    buscando = true
    e.target.src = 'close.png'
    if (e.target.classList.contains('cancelar-favoritos-activado')) {
        const encabezado_eliminar = document.querySelector('.encabezado')
        contenedor.classList.remove('contenedor-favoritos')
        if (encabezado_eliminar) {
            encabezado_eliminar.remove()
        }
        contenedor.innerHTML = ''
        loadMorePokemons()
        e.target.src = 'estrella.png'
        e.target.classList.remove('cancelar-favoritos-activado')
    } else {
        e.target.classList.add('cancelar-favoritos-activado')
        const mainContainer = document.querySelector('.contenedor');
        const encabezado_eliminar = document.querySelector('.encabezado')
        mainContainer.classList.add('contenedor-favoritos')
        if (encabezado_eliminar) {
            encabezado_eliminar.remove()
        }
        mainContainer.innerHTML = '';

        let encabezado_favorito = `
        <div class="encabezado">
           
                <img class="cancelar-favoritos" src="estrella.png" alt="">
            
            <h3>POKEMONES FAVORITOS</h3>
        </div>
        `;
        mainContainer.insertAdjacentHTML('beforebegin', encabezado_favorito);
        let pokemonDATA = JSON.parse(localStorage.getItem('pokemon'))
        for (const key in pokemonDATA) {
            fetch(pokemonDATA[key].url).then(response => response.json()).then((resultado) => {
                fetch(resultado.species.url).then((response) => { return response.json() })
                    .then((data3) => {

                        let pokemon_favoritoDATA = JSON.parse(localStorage.getItem('pokemon'))
                        let pokemon_favorito_comprobacion = {}

                        for (const key in pokemon_favoritoDATA) {
                            if (resultado.name === key) {
                                pokemon_favorito_comprobacion[resultado.name] = resultado.name
                            }
                        }

                        let tipo = '' //Intentar quitar los guiones para que no se vea feo
                        let inf = ''

                        resultado.types.forEach(i => tipo += ' ' + i.type.name)
                        inf += `<div class="contendor-card">
            <div class="card">
                <div class="nombre-pokemon">
                    ${resultado.name}
                <img class="favorito" pokemon-name="${resultado.name}" src=${pokemon_favorito_comprobacion[resultado.name] ? 'favorito-agregado.png' : 'favorito.png'} alt=""></div>
                <div class="sub-info">
                    <div class="inf">${tipo}</div>
                    <div class="inf">${data3.habitat !== null ? data3.habitat.name : 'No hay habitad'}</div>
                </div>
                <div class="btn" url="${pokemonDATA[key].url}"><img class="btn-2" src="pokebola.png" alt=""></div>
            </div>
        </div>`

                        if (inf !== '') {
                            mainContainer.innerHTML += inf;
                            nro_pokemon += 1;
                            console.log(nro_pokemon);
                        } else {
                            mainContainer.innerHTML = `<h1>-SE ACABO LA LISTA DE POKEMONES-</h1>`;
                            return;
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
                        for (const iterator of favorito) {
                            iterator.addEventListener('click', (e) => {

                                const pokemonName = e.target.getAttribute('pokemon-name');
                                let storedData = JSON.parse(localStorage.getItem('pokemon')) || {};

                                // Verifica si el pokemon ya está en el objeto almacenado
                                if (storedData[pokemonName]) {
                                    // Si está, elimínalo del objeto
                                    delete storedData[pokemonName];
                                    e.target.src = 'favorito.png';
                                } else {
                                    // Si no está, agrégalo al objeto
                                    storedData[pokemonName] = { name: pokemonName, url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/` };
                                    e.target.src = 'favorito-agregado.png';
                                }

                                // Guarda el objeto actualizado en el localStorage
                                localStorage.setItem('pokemon', JSON.stringify(storedData));

                            }
                            )
                        }

                    })
            })
        }
    }
})

btn_about_me.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancelar-activado')) {
        e.target.classList.remove('cancelar-activado')
        e.target.src = 'ayudar.png'
        footer.classList.remove('footer-activado')
        document.querySelector('.information-about-me').classList.remove('information-about-me-activado')

    } else {
        e.target.classList.add('cancelar-activado')
        e.target.src = 'multiply.png'
        footer.classList.add('footer-activado')
        document.querySelector('.information-about-me').classList.add('information-about-me-activado')
    }


})

document.querySelector('.logo-red-social').addEventListener('click', (e) => {
    let cont_palabra = document.querySelector('.red-social')
    for (const letra of 'facebook') {
                
            cont_palabra.innerHTML += letra

        
    }


})