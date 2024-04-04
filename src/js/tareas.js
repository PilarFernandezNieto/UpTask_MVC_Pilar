// IIFE
(function () {
  obtenerTareas();

  // Variable global para las tareas de un proyecto
  let tareas = [];

  // Botón para mostrar el modal de agregar tarea
  const nuevaTareaBtn = document.querySelector("#agregar-tarea");
  nuevaTareaBtn.addEventListener("click", mostrarFormulario);

  /**
   * The function "obtenerTareas" asynchronously fetches tasks data from an API based on a project URL
   * and then displays the tasks.
   */
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

  /**
   * La función muestra la lista de tareas de un proyecto con opción para cambiar su estado o borrarla.
   * Muestra un mensaje si el proyecto no tiene tareas.
   * @returns Muestra las tareas del proyecto si las hay o un mensaje en caso de no haberas.
   *
   */
  function mostrarTareas() {
    limpiarTareas();
    if (tareas.length === 0) {
      const contenedorTareas = document.querySelector("#listado-tareas");
      const textoNoTareas = document.createElement("li");
      textoNoTareas.textContent = "No hay tareas";
      textoNoTareas.classList.add("no-tareas");
      contenedorTareas.appendChild(textoNoTareas);
      return;
    }

    const estados = {
      0: "Pendiente",
      1: "Completa",
    };
    tareas.forEach((tarea) => {
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

      btnEstadoTarea.ondblclick = function () {
        cambiarEstadoTarea({ ...tarea });
      };

      const btnEliminarTarea = document.createElement("button");
      btnEliminarTarea.classList.add("eliminar-tarea");
      btnEliminarTarea.dataset.idTarea = tarea.id;
      btnEliminarTarea.textContent = "Eliminar";
      btnEliminarTarea.ondblclick = function(){
        confirmarEliminarTarea({...tarea});
      }

      opcionesDiv.appendChild(btnEstadoTarea);
      opcionesDiv.appendChild(btnEliminarTarea);
      contenedorTarea.appendChild(nombreTarea);
      contenedorTarea.appendChild(opcionesDiv);

      const listadoTareas = document.querySelector("#listado-tareas");
      listadoTareas.appendChild(contenedorTarea);
    });
  }

  /**
   * Crea un modal con un formulario para añadir tareas a un proyecto.
   */
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

  /**
   * Crea y muestra una alerta con un mensaje concreto, un tipo de mensaje (exito o error) y en un elemento concreto del html.
   * La alerta desaparece a los 5 segundos.
   * @param {string} mensaje - El mensaje que muestra la alerta
   * @param {string} tipo - Éxito o Error. Añade la clase correspondiente para darle estilos
   * @param {string referencia - El elemento html donde se va a añadir la alerta
   */
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
  /**
   * Inserta una tarea en un proyecto existente mediante una llamada a la API y muestra una alerta basada en la respuesta
   * @param {string} tarea - Nombre de la tarea que se va a añadir
   */
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
          id: String(resultado.id),
          nombre: tarea,
          estado: "0",
          proyectoId: resultado.proyectoId,
        };

        tareas = [...tareas, tareaObj];
        mostrarTareas();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function cambiarEstadoTarea(tarea) {
    const nuevoEstado = tarea.estado === "1" ? "0" : "1";
    tarea.estado = nuevoEstado;

    actualizarTarea(tarea);
  }

  async function actualizarTarea(tarea) {
    const {estado, id, nombre, proyectoId} = tarea;
    const datos = new FormData();
    datos.append("id", id);
    datos.append("nombre", nombre);
    datos.append("estado", estado);
    datos.append("proyectoId", obtenerProyecto()); // OJO AQUI. Envia la url del proyecto en vez de ID

    // for(let valor of datos.values()){
    //   console.log(valor);
    // }

    try {
      const url = "http://localhost:3000/api/tarea/actualizar";
      const respuesta = await fetch(url, {
        method: "POST",
        body: datos
      });

      const resultado = await respuesta.json();

      if(resultado.respuesta.tipo === "exito"){
        mostrarAlerta(resultado.respuesta.mensaje, resultado.respuesta.tipo, document.querySelector(".contenedor-nueva-tarea"));
        tareas = tareas.map(tareaMemoria => {
          if(tareaMemoria.id === id){
            tareaMemoria.estado = estado;
          } 
          return tareaMemoria;
        });
        mostrarTareas();
        
      }

    } catch(error){
      console.log(error);
    }
  }

  function confirmarEliminarTarea(tarea){
    Swal.fire({
      title: "¿Eliminar Tarea?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        eliminarTarea(tarea);
      } 
    });
  }

  async function eliminarTarea(tarea){
    const { estado, id, nombre } = tarea;
    const datos = new FormData();
    datos.append("id", id);
    datos.append("nombre", nombre);
    datos.append("estado", estado);
    datos.append("proyectoId", obtenerProyecto()); // OJO AQUI. Envia la url del proyecto en vez de ID

    try {
      const url = "http://localhost:3000/api/tarea/eliminar";
      const respuesta = await fetch(url, {
        method: "POST",
        body: datos
      });
      const resultado = await respuesta.json();
      console.log(resultado);

      
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Extrae la url del proyecto de la cadena de consulta de la url actual
   * @returns {string} - El valor de la propiedad url del objeto Proyecto
   *
   */
  function obtenerProyecto() {
    const proyectoParams = new URLSearchParams(window.location.search);
    const proyecto = Object.fromEntries(proyectoParams.entries());
    return proyecto.url;
  }

  /**
   * Limpia el listado de tareas antes de mostrarlas
   */
  function limpiarTareas() {
    const listadoTareas = document.querySelector("#listado-tareas");
    while (listadoTareas.firstChild) {
      listadoTareas.removeChild(listadoTareas.firstChild);
    }
  }
})();
