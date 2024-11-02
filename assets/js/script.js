const API_KEY = '5a023eec52da1cb935bd773c7cb6f241';
const API_URL = 'https://www.superheroapi.com/api.php';

$(document).ready(function() {
    $('#btn').click(function() {
        const heroId = $('#IdHeroe').val();
        if (validarHeroId(heroId)) {
            buscarSuperheroe(heroId);
        }
    });
});

function validarHeroId(heroId) {
    if (!$.isNumeric(heroId) || heroId < 1 || heroId > 731) {
        alert('Ingresa un número del 1 al 731 para encontrar tu SuperHero.');
        return false;
    }
    return true;
}

function buscarSuperheroe(heroId) {
    $.ajax({
        method: 'GET',
        url: `${API_URL}/${API_KEY}/${heroId}`,
        dataType: "json",
        success: function(heroe) {
            if (heroe.response === 'error') {
                alert('Superhéroe no encontrado.');
                return;
            }
            mostrarInformacionHeroe(heroe);
            crearGrafico(heroe.powerstats);
        },
        error: function() {
            alert('Error al buscar el superhéroe. Intenta nuevamente.');
        }
    });
}

function mostrarInformacionHeroe(heroe) {
    const tarjetaHeroe = `
        <div class="card w-100">
            <div class="row">
                <div class="col-md-6">
                    <img src="${heroe.image.url}" 
                         class="card-img heroe-image" 
                         alt="${heroe.name}">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${heroe.name}</h5>
                        <p class="card-text">Nombre completo: ${heroe.biography['full-name']}</p>
                        <p class="card-text">Inteligencia: ${heroe.powerstats.intelligence}</p>
                        <p class="card-text">Fuerza: ${heroe.powerstats.strength}</p>
                        <p class="card-text">Velocidad: ${heroe.powerstats.speed}</p>
                        <p class="card-text">Durabilidad: ${heroe.powerstats.durability}</p>
                        <p class="card-text">Poder: ${heroe.powerstats.power}</p>
                        <p class="card-text">Combate: ${heroe.powerstats.combat}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#heroInfo').html(tarjetaHeroe);
}

function crearGrafico(estadisticas) {
    const datosGrafico = [];
    for (let stat in estadisticas) {
        datosGrafico.push({
            label: capitalizarPrimeraLetra(stat),
            y: parseInt(estadisticas[stat]) || 0
        });
    }

    const grafico = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Estadísticas de Poder"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: true,
            legendText: "{label}",
            indexLabelFontSize: 19,
            indexLabel: "{label} - {y}",
            dataPoints: datosGrafico
        }]
    });

    grafico.render();
}

function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}