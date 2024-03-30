// IIFE
(function () {
  // Botón para mostrar el modal de agregar tarea
  const nuevaTareaBtn = document.querySelector("#agregar-tarea");
  nuevaTareaBtn.addEventListener("click", mostrarFormulario);

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
      mostrarAlerta("El nombre de la tarea es obligatorio", "error", document.querySelector(".formulario legend"));
      return;
    }
    agregarTarea(alerta);
  }

  function mostrarAlerta(mensaje, tipo, referencia) {

    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia){
        alertaPrevia.remove();
    }
    const alerta = document.createElement("div");
    alerta.classList.add("alerta", tipo);
    alerta.textContent = mensaje;

    // Inserta la alerta antes del legend
    referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
  }

  // API
  async function agregarTarea(tarea){
    // Petición
    const datos = new FormData();
    datos.append("nombre", "Pilar");

    try {
        const url = "http://localhost:3000/api/tarea";
        const respuesta = await fetch(url, {
            method: "post",
            body: datos
        });
        console.log(respuesta);

    }catch(error){
        console.log(error);
    }
  }


})();
