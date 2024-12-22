// Me conecto a los elementos del DOM
const campoTarea = document.getElementById('campo-tarea')
const botonAgregar = document.getElementById('boton-agregar')
const listaTareas = document.getElementById('lista-de-tareas')
const totalTareasContador = document.getElementById('total-tareas-contador')
const tareasCompletadas = document.getElementById('tareas-completadas')

// Tareas iniciales
let tareasLista = [
    { id: 16, nombre: 'Hacer mercado' },
    { id: 60, nombre: 'Estudiar para la prueba' },
    { id: 24, nombre: 'Sacar a pasear a Tobby' }
]

// Arreglo para mantener los IDs disponibles
let idsDisponibles = []

// Las tareas que entren inicial con el ID más alto en la lista de tareas
let ultimoIdAsignado = tareasLista.length > 0 ? Math.max(...tareasLista.map(tarea => tarea.id)) : 0

// Verificar si una tarea ya existe para que no se repitan
const tareaYaExiste = (nombreTarea) => {
    return tareasLista.some(tarea => tarea.nombre.toLowerCase() === nombreTarea.toLowerCase())
};

// Agregar nuevas tareas
botonAgregar.addEventListener("click", () => {
    const nuevaTarea = campoTarea.value
    if (nuevaTarea.trim() === "") {
        alert("Por favor, ingresa una tarea.")
        return
    }

    if (tareaYaExiste(nuevaTarea)) {
        alert("Esta tarea ya existe en la lista.")
    } else {
        //Voy a reutilizar un ID disponible si lo hay, sino voy a incrementar el ID más alto
        let nuevoId
        if (idsDisponibles.length > 0) {
            nuevoId = idsDisponibles.pop()  // Usa un ID disponible
        } else {
            nuevoId = ultimoIdAsignado + 1  // Si no hay IDs disponibles, usa el siguiente ID
        }

        tareasLista.push({ id: nuevoId, nombre: nuevaTarea })
        ultimoIdAsignado = Math.max(...tareasLista.map(tarea => tarea.id))  // Actualiza el último ID
        mostrarTareas()
        campoTarea.value = ''
    }
})

// mostrar las tareas
const mostrarTareas = () => {
    listaTareas.innerHTML = tareasLista.map((tarea, index) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${tarea.id}</span>
        <span>${tarea.nombre}</span>
        <section class="cajas">
          <input class="form-check-input me-4" type="checkbox" id="checkbox-${index}" ${tarea.completed ? 'checked' : ''}>
          <span class="icono-eliminar" style="color: red; font-size: 1em; cursor: pointer;">Quitar</span>
        </section>
      </li>
    `).join('')

    totalTareasContador.textContent = tareasLista.length
    tareasCompletadas.textContent = tareasLista.filter(tarea => tarea.completed).length

    listaTareas.querySelectorAll('.form-check-input').forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            tareasLista[index].completed = checkbox.checked
            tareasCompletadas.textContent = tareasLista.filter(tarea => tarea.completed).length
        })
    })
}

// Eliminar tareas
listaTareas.addEventListener('click', (event) => {
    if (event.target.classList.contains('icono-eliminar')) {
        const tareaParaBorrar = event.target.closest('.list-group-item')
        const index = Array.from(listaTareas.children).indexOf(tareaParaBorrar)
        if (index > -1) {
            const tareaBorrada = tareasLista.splice(index, 1)[0]  // Elimino la tarea y la guardo
            idsDisponibles.push(tareaBorrada.id)  // Añadir el ID al arreglo de IDs disponibles
            mostrarTareas()
        }
    }
})

// mostrar tareas al cargar
mostrarTareas()
