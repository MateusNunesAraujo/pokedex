let contenedor = document.querySelector('.contenedor')
let modal = document.querySelector('.modal')
let cancelar = document.querySelector('.cancelar')
let cont_habilidades = document.querySelector('.habilidades')



const url_api = "https://pokeapi.co/api/v2/pokemon?limit=100?limit=100&offset=0";
const demostracion = document.querySelector("#demostracion")
fetch(url_api).then((response) => { return response.json() })
    .then((data) => {
        data.results.forEach(element => {
            fetch(element.url).then((response) => { return response.json() })
                .then((data2) => {
                    fetch(data2.species.url).then((response) => { return response.json() })
                        .then((data3) => {
                            /* console.log(data3) */
                            let tipo = '' //Intentar quitar los guiones para que no se vea feo
                            let inf = ''
                            data2.types.forEach(i => tipo += ' ' + i.type.name)
                            inf += `<div class="contendor">
                            <div class="card">
                                <div class="nombre-pokemon">${element.name}</div>
                                <div class="sub-info">
                                    <div class="inf">${tipo}</div>
                                    <div class="inf">${data3.habitat.name}</div>
                                </div>
                                <div class="btn" url="${element.url}"><img class="btn-2" src="pokebola.png" alt=""></div>
                            </div>
                        </div>`

                            contenedor.innerHTML += inf
                            for (let card of contenedor.children) {

                                let contenedores = card.children
                                console.log(contenedores)
                                for (let nombre of contenedores) {
                                    console.log(nombre.children[0].style.color += data3.color.name)
                                }
                            }
                            let btn = document.querySelectorAll('.btn-2')
                            for (let index = 0; index < btn.length; index++) {
                                const element = btn[index];
                                element.addEventListener('click', (e) => {
                                    e.target.classList.add('btn-precionado')
                                    setTimeout(() => {
                                        e.target.classList.remove('btn-precionado')
                                    }, 100);
                                    modal.classList.add('modal--show')
                                })

                            }

                            for (let element of btn) {
                                element.addEventListener('click', (e) => {
                                    let url = e.target.parentElement.getAttribute('url')
                                    fetch(url).then(response => response.json()).then((data4) => {
                                        /* console.log(data4) */
                                        document.querySelector('.contenedor-icono img').src = data4.sprites.front_default
                                        document.querySelector('#nombre-pokemon').textContent = data4.name
                                        /* Agregar clase del pokemon */
                                        fetch(data4.species.url).then(response => response.json()).then((data5) => {
                                            data5.flavor_text_entries.forEach((nombre) => {
                                                if (nombre.language.name == 'es') {

                                                    document.querySelector('.descripcion').textContent = nombre.flavor_text
                                                }
                                            })
                                        })
                                        let habilidades = ''
                                        data4.moves.forEach((element, i) => {
                                            fetch(element.move.url).then(response => response.json()).then((data6) => {
                                                if (i <= 3) {
                                                    let descripcionEs = data6.flavor_text_entries.find(entry => entry.language.name === 'es');
                                                    habilidades += `<div class="contenedor-habilidades">
                                                                        <div class="nombre-habilidad">${data6.names[5].name}</div>
                                                                        <div class="poder-tipo">
                                                                            <div>[power]</div>
                                                                            <div>[tipo]</div>
                                                                        </div>
                                                                        <div class="descripcion-habilidad">${descripcionEs ? descripcionEs.flavor_text : 'Descripción no disponible'}</div>
                                                                    </div>`;
                                                    cont_habilidades.innerHTML = habilidades;
                                                }
                                            });
                                        });
                                    })
                                })
                            }

                        })

                })
        })
    })

cancelar.addEventListener('click', (e) => {
    console.log('precionado_cancelar')
    modal.classList.remove('modal--show')
    e.target.classList.add('cancelar-precionado')
    setTimeout(() => {
        e.target.classList.remove('cancelar-precionado')
    }, 100);

})





