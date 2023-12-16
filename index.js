let contenedor = document.querySelector('.contenedor')

const url_api = "https://pokeapi.co/api/v2/pokemon?limit=20?limit=20&offset=20";
const demostracion = document.querySelector("#demostracion")
fetch(url_api).then((response) => { return response.json() })
    .then((data) => {
        console.log()
        data.results.forEach(element => {
            fetch(element.url).then((response) =>{ return response.json()})
            .then((data2) => 
            { 
                let tipo = '' //Intentar quitar los guiones para que no se vea feo
                data2.types.forEach(i => tipo += '-' + i.type.name)
                let inf = ''
                data.results.forEach(element => {
                
                    inf += `<div class="contendor">
                    <div class="card">
                        <div class="nombre-pokemon">${element.name}</div>
                        <div class="sub-info">
                            <div >${tipo}</div>
                            <div>[elemento]</div>
                        </div>
                        <div class="btn"><img src="pokebola.png" alt=""></div>
                    </div>
                </div>`
                });
                contenedor.innerHTML += inf})
        })
       /*  console.log(data)
        let inf = ''
        data.results.forEach(element => {
        
            inf += `<div class="contendor">
            <div class="card">
                <div class="nombre-pokemon">${element.name}</div>
                <div class="sub-info">
                    <div >[tipo]</div>
                    <div>[elemento]</div>
                </div>
                <div class="btn"><img src="pokebola.png" alt=""></div>
            </div>
        </div>`
        });
        contenedor.innerHTML += inf */
        
        })