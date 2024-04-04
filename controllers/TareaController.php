<?php

namespace Controllers;

use Model\Tarea;
use Model\Proyecto;



class TareaController {

    public static function index() {
        session_start();

        $proyectoId = $_GET["url"];

        if(!$proyectoId) header("Location: /dashboard");

        $proyecto = Proyecto::where("url", $proyectoId);

        if(!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]){
            header("Location: /404");
        }
        $tareas = Tarea::belongsTo("proyectoId", $proyecto->id);

       echo json_encode(["tareas" => $tareas]);
    }
    
    public static function crear() {

        if ($_SERVER["REQUEST_METHOD"] === "POST") {

            session_start();

            $proyecto = Proyecto::where("url", $_POST["proyectoId"]);

            // Comprobamos que existe un proyecto y que ese proyecto pertence a la persona logueada
            if (!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]) {
                $respuesta = [
                    "tipo" => "error",
                    "mensaje" => "Hubo un error al agregar la tarea"
                ];
                echo json_encode($respuesta);
                return;
            }

            // Si OK: Instanciar y crear la tarea
            $tarea = new Tarea($_POST);

            $tarea->proyectoId = $proyecto->id;
          
            $resultado = $tarea->guardar();

            $respuesta = [
                "tipo"=>"exito",
                "id"=>$resultado["id"],
                "mensaje" => "Tarea creada correctamente",
                "proyectoId" => $proyecto->id
            ];

            echo json_encode($respuesta);
        }
    }
    public static function actualizar() {
        session_start();

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $proyecto = Proyecto::where("url", $_POST["proyectoId"]);

            // Comprobamos que existe un proyecto y que ese proyecto pertence a la persona logueada
            if (!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]) {
                $respuesta = [
                    "tipo" => "error",
                    "mensaje" => "Hubo un error al actualizar la tarea"
                ];
                echo json_encode($respuesta);
                return;
            }

            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id; // OJO AQUI. PROYECTOID VIENE COMO URL

            $resultado = $tarea->guardar();

            if($resultado){
                $respuesta = [
                    "tipo" => "exito",
                    "id" => $tarea->id,
                    "proyectoId" => $proyecto->id,
                    "mensaje" => "Actualizado correctamente"
                ];
                echo json_encode(["respuesta" => $respuesta]);

            }
             
        }
    }

    public static function eliminar() {
        session_start();

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $proyecto = Proyecto::where("url", $_POST["proyectoId"]);

            // Comprobamos que existe un proyecto y que ese proyecto pertence a la persona logueada
            if (!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]) {
                $respuesta = [
                    "tipo" => "error",
                    "mensaje" => "Hubo un error al actualizar la tarea"
                ];
                echo json_encode($respuesta);
                return;
            }

            $tarea = new Tarea($_POST);
            $resultado = $tarea->eliminar();

            $resultado = [
                "resultado" => $resultado,
                "mensaje" => "Eliminada con éxito"
            ];

            echo json_encode($resultado);
        }
    }
}
