// IIFE
(function () {
  obtenerTareas();
  let tareas = [];
  // Botón para mostrar el modal de agregar tarea
  const nuevaTareaBtn = document.querySelector("#agregar-tarea");
  nuevaTareaBtn.addEventListener("click", mostrarFormulario);

  async function obtenerTareas() {
    try {
      const proyectoUrl = obtenerProyecto();
      const url = `/api/tareas?url=${proyectoUrl}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      tareas = resultado.tareas;
      mostrarTareas();

    } catch (error) {
      console.log(error);
    }
  }
  function mostrarTareas(){
    console.log(tareas);
    if(tareas.length === 0){
        const contenedorTareas = document.querySelector("#listado-tareas");
        const textoNoTareas = document.createElement("li");
        textoNoTareas.textContent = "No hay tareas";
        textoNoTareas.classList.add("no-tareas");
        contenedorTareas.appendChild(textoNoTareas);
        return;
    }

    const estados = {
      0: "Pendiente",
      1: "Completa"
    }
    tareas.forEach(tarea => {
        const contenedorTarea = document.createElement("li");
        contenedorTarea.dataset.tareaId = tarea.id;
        contenedorTarea.classList.add("tarea");
        const nombreTarea = document.createElement("p");
        nombreTarea.textContent = tarea.nombre;

        const opcionesDiv = document.createElement("div");
        opcionesDiv.classList.add("opciones");

        // Botones
        const btnEstadoTarea = document.createElement("button");
        btnEstadoTarea.classList.add("estado-tarea");
        btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`);
        btnEstadoTarea.textContent = estados[tarea.estado];
        btnEstadoTarea.dataset.estadoTarea = tarea.estado;

        const btnEliminarTarea = document.createElement("button");
        btnEliminarTarea.classList.add("eliminar-tarea");
        btnEliminarTarea.dataset.idTarea = tarea.id;
        btnEliminarTarea.textContent= "Eliminar";

        opcionesDiv.appendChild(btnEstadoTarea);
        opcionesDiv.appendChild(btnEliminarTarea);
        contenedorTarea.appendChild(nombreTarea);
        contenedorTarea.appendChild(opcionesDiv);

        const listadoTareas = document.querySelector("#listado-tareas");
        listadoTareas.appendChild(contenedorTarea);

        console.log(contenedorTarea);
    })
  }

  function mostrarFormulario() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <form class="formulario nueva-tarea">
            <legend>Añade una nueva tarea</legend>
            <div class="campo">
                <label for="tarea">Tarea</label>
                <input type="text" name="tarea" id="tarea" placeholder="Añadir tarea al proyecto"/>
            </div>
            <div class="opciones">
                <input type="submit" class="submit-nueva-tarea" value="Añadir Tarea"/>
                <button type="button" class="cerrar-modal">Cancelar</button>
            </div>

        </form>
    `;

    setTimeout(() => {
      const formulario = document.querySelector(".formulario");
      formulario.classList.add("animar");
    }, 0);

    modal.addEventListener("click", function (e) {
      e.preventDefault();

      if (e.target.classList.contains("cerrar-modal")) {
        const formulario = document.querySelector(".formulario");
        formulario.classList.add("cerrar");
        setTimeout(() => {
          modal.remove();
        }, 500);
      }
      if (e.target.classList.contains("submit-nueva-tarea")) {
        submitFormularioNuevaTarea();
      }
    });

    document.querySelector(".dashboard").appendChild(modal);
  }

  function submitFormularioNuevaTarea() {
    const tarea = document.querySelector("#tarea").value.trim();

    if (tarea === "") {
      // Alerta de error
      mostrarAlerta(
        "El nombre de la tarea es obligatorio",
        "error",
        document.querySelector(".formulario legend")
      );
      return;
    }
    agregarTarea(tarea);
  }

  function mostrarAlerta(mensaje, tipo, referencia) {
    const alertaPrevia = document.querySelector(".alerta");
    if (alertaPrevia) {
      alertaPrevia.remove();
    }
    const alerta = document.createElement("div");
    alerta.classList.add("alerta", tipo);
    alerta.textContent = mensaje;

    // Inserta la alerta antes del legend
    referencia.parentElement.insertBefore(
      alerta,
      referencia.nextElementSibling
    );

    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }

  // API
  async function agregarTarea(tarea) {
    // Petición
    const datos = new FormData();
    datos.append("nombre", tarea);
    datos.append("proyectoId", obtenerProyecto());

    try {
      const url = "http://localhost:3000/api/tarea";
      const respuesta = await fetch(url, {
        method: "post",
        body: datos,
      });
      const resultado = await respuesta.json();

      mostrarAlerta(
        resultado.mensaje,
        resultado.tipo,
        document.querySelector(".formulario legend")
      );

      if (resultado.tipo === "exito") {
        const modal = document.querySelector(".modal");
        setTimeout(() => {
          modal.remove();
        }, 2000);

        // Agregar el objeto de tarea al global de tareas
        const tareaObj = {
         
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function obtenerProyecto() {
    const proyectoParams = new URLSearchParams(window.location.search);
    const proyecto = Object.fromEntries(proyectoParams.entries());
    return proyecto.url;
  }
})();
