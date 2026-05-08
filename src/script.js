const inputTarea = document.getElementById("inputTarea");
const prioridad = document.getElementById("prioridad");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("listaTareas");
const botonesFiltro = document.querySelectorAll("[data-filtro]");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

renderizarTareas();

btnAgregar.addEventListener("click", agregarTarea);

function agregarTarea() {
  const texto = inputTarea.value.trim();

  if (texto === "") {
    alert("Ingresa una tarea");
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    texto: texto,
    prioridad: prioridad.value,
    completada: false
  };

  tareas.push(nuevaTarea);

  guardarLocalStorage();
  renderizarTareas();

  inputTarea.value = "";
}

function renderizarTareas(filtro = "todas") {
  listaTareas.innerHTML = "";

  let tareasFiltradas = tareas;

  if (filtro === "pendientes") {
    tareasFiltradas = tareas.filter(t => !t.completada);
  }

  if (filtro === "completadas") {
    tareasFiltradas = tareas.filter(t => t.completada);
  }

  tareasFiltradas.forEach(tarea => {
    const li = document.createElement("li");

    li.classList.add("tarea");

    if (tarea.completada) {
      li.classList.add("completada");
    }

    li.innerHTML = `
      <div class="info">
        <span class="texto">${tarea.texto}</span>
        <span class="prioridad ${tarea.prioridad.toLowerCase()}">
          Prioridad: ${tarea.prioridad}
        </span>
      </div>

      <div class="botones">
        <button class="completar" onclick="toggleCompletada(${tarea.id})">
          ${tarea.completada ? "Desmarcar" : "Completar"}
        </button>

        <button class="eliminar" onclick="eliminarTarea(${tarea.id})">
          Eliminar
        </button>
      </div>
    `;

    listaTareas.appendChild(li);
  });
}

function toggleCompletada(id) {
  tareas = tareas.map(tarea => {
    if (tarea.id === id) {
      tarea.completada = !tarea.completada;
    }

    return tarea;
  });

  guardarLocalStorage();
  renderizarTareas();
}

function eliminarTarea(id) {
  tareas = tareas.filter(tarea => tarea.id !== id);

  guardarLocalStorage();
  renderizarTareas();
}

function guardarLocalStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    const filtro = boton.dataset.filtro;
    renderizarTareas(filtro);
  });
});