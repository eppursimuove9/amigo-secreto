// Variables globales para compatibilidad
let amigos = [];
let juegoIniciado = false; // Nueva variable para controlar el estado del juego

/**
 * Genera un número aleatorio más robusto
 * @param {number} max - Número máximo (exclusivo)
 * @returns {number} - Índice aleatorio
 */
function generarIndiceAleatorio(max) {
    // Usar crypto.getRandomValues si está disponible para mayor aleatoriedad
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }
    
    // Fallback con timestamp y múltiples Math.random()
    const timestamp = Date.now();
    const random1 = Math.random();
    const random2 = Math.random();
    const semilla = (timestamp * random1 * random2) % 1;
    
    return Math.floor(semilla * max);
}

/**
 * Agrega un amigo a la lista
 */
function agregarAmigo() {
    const input = document.getElementById("amigo");
    const nombre = input.value.trim();

    if (validarNombre(nombre)) {
        const nombreCapitalizado = capitalizarNombre(nombre);
        amigos.push(nombreCapitalizado);
        mostrarAmigo(nombreCapitalizado);
        input.value = '';
        input.focus();
    }
}

/**
 * Valida si el nombre es válido
 * @param {string} nombre - El nombre a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validarNombre(nombre) {
    const validaciones = [
        {
            condicion: !nombre,
            mensaje: "No puede agregar nombres vacíos"
        },
        {
            condicion: !/^[A-Za-zÀ-ÿ\u0100-\u017F\s]+$/.test(nombre),
            mensaje: "El nombre solo debe contener letras"
        },
        {
            condicion: existeAmigo(nombre),
            mensaje: "No se pueden repetir nombres"
        }
    ];

    for (const validacion of validaciones) {
        if (validacion.condicion) {
            alert(validacion.mensaje);
            return false;
        }
    }

    return true;
}

/**
 * Verifica si un amigo ya existe en la lista
 * @param {string} nombre - El nombre a verificar
 * @returns {boolean} - True si existe, false si no
 */
function existeAmigo(nombre) {
    return amigos.some(amigo => 
        amigo.toLowerCase() === nombre.toLowerCase()
    );
}

/**
 * Capitaliza cada palabra del nombre
 * @param {string} nombre - El nombre a capitalizar
 * @returns {string} - El nombre capitalizado
 */
function capitalizarNombre(nombre) {
    return nombre
        .split(' ')
        .map(palabra => 
            palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
        )
        .join(' ');
}

/**
 * Muestra un amigo en la lista HTML
 * @param {string} nombre - El nombre del amigo a mostrar
 */
function mostrarAmigo(nombre) {
    const lista = document.getElementById("listaAmigos");
    if (!lista) return;

    const li = document.createElement("li");
    li.textContent = nombre;
    
    const btnEliminar = crearBotonEliminar(nombre, li);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
}

/**
 * Crea un botón de eliminar para un amigo
 * @param {string} nombre - El nombre del amigo
 * @param {HTMLElement} li - El elemento li que contiene al amigo
 * @returns {HTMLElement} - El botón de eliminar
 */
function crearBotonEliminar(nombre, li) {
    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.className = "btn-eliminar";
    btn.title = `Eliminar ${nombre}`;
    
    btn.addEventListener("click", () => {
        eliminarAmigo(nombre, li);
    });

    return btn;
}

/**
 * Elimina un amigo de la lista
 * @param {string} nombre - El nombre del amigo a eliminar
 * @param {HTMLElement} li - El elemento li a eliminar
 */
function eliminarAmigo(nombre, li) {
    const index = amigos.findIndex(amigo => 
        amigo.toLowerCase() === nombre.toLowerCase()
    );
    
    if (index !== -1) {
        amigos.splice(index, 1);
    }

    li.remove();
    
    // Si se eliminan amigos después de haber iniciado el juego, 
    // verificar si aún se puede continuar
    if (juegoIniciado && amigos.length === 0) {
        juegoIniciado = false; // Reset del estado del juego
        limpiarResultado();
    }
}

/**
 * Sortea un amigo secreto
 */
function sortearAmigo() {
    // Solo validar mínimo de amigos si es el INICIO del juego (no cuando ya se está jugando)
    if (!juegoIniciado && amigos.length < 2) {
        alert("Agrega al menos 2 amigos para poder sortear");
        return;
    }
    
    // Si llegamos aquí, el juego ya comenzó
    juegoIniciado = true;

    // Usar el nuevo método de aleatoriedad más robusto
    const indiceAleatorio = generarIndiceAleatorio(amigos.length);
    const amigoSorteado = amigos[indiceAleatorio];

    console.log(`Amigos disponibles: ${amigos.length}`);
    console.log(`Lista actual: [${amigos.join(', ')}]`);
    console.log(`Índice aleatorio generado: ${indiceAleatorio}`);
    console.log(`Amigo sorteado: ${amigoSorteado}`);

    mostrarResultado(amigoSorteado);
    amigos.splice(indiceAleatorio, 1);
    actualizarListaHTML();

    // Solo verificar DESPUÉS de eliminar el amigo sorteado
    if (amigos.length === 0) {
        setTimeout(() => {
            alert("¡Juego completado! Reiniciando para una nueva ronda...");
            reiniciarJuego();
        }, 2000);
    }
}

/**
 * Muestra el resultado del sorteo
 * @param {string} nombre - El nombre del amigo sorteado
 */
function mostrarResultado(nombre) {
    const resultado = document.getElementById("resultado");
    if (!resultado) return;

    resultado.innerHTML = '';

    const li = document.createElement("li");
    li.textContent = `El amigo secreto sorteado es: ${nombre}`;
    resultado.appendChild(li);
}

/**
 * Actualiza la lista HTML después de un sorteo
 */
function actualizarListaHTML() {
    const lista = document.getElementById("listaAmigos");
    if (!lista) return;

    lista.innerHTML = '';
    amigos.forEach(nombre => {
        mostrarAmigo(nombre);
    });
}

/**
 * Limpia el resultado del sorteo
 */
function limpiarResultado() {
    const resultado = document.getElementById("resultado");
    if (resultado) {
        resultado.innerHTML = '';
    }
}

/**
 * Reinicia completamente el juego
 */
function reiniciarJuego() {
    amigos = [];
    juegoIniciado = false; // Resetear el estado del juego
    limpiarResultado();
    
    const lista = document.getElementById("listaAmigos");
    if (lista) lista.innerHTML = '';
    
    const input = document.getElementById("amigo");
    if (input) input.focus();
    
    console.log("Juego reiniciado. ¡Agrega nuevos amigos para comenzar!");
}

/**
 * Agrega la funcionalidad de Enter en el input
 */
function añadirAmigoConEnter() {
    const input = document.getElementById("amigo");
    if (input) {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                agregarAmigo();
            }
        });
    }
}

/**
 * Inicialización cuando se carga la página
 */
window.onload = function () {
    const input = document.getElementById("amigo");
    if (input) input.focus();
    añadirAmigoConEnter();
};