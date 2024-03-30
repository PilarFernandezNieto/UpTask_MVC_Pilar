<?php 
namespace Controllers;

use MVC\Router;
use Model\Proyecto;

class DashboardController {

    public static function index(Router $router){
        session_start();

        isAuth();

        $id = $_SESSION["id"];
        $proyectos = Proyecto::belongsTo("propietarioId", $id);
       
       
        $router->render("dashboard/index", [
            "titulo" => "Proyectos",
            "proyectos" => $proyectos
        ]);
    }

    public static function crear_proyecto(Router $router){
        
        session_start();

        isAuth();

        $alertas = [];

        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $proyecto = new Proyecto($_POST);

            $alertas = $proyecto->validarProyecto();

            if(empty($alertas)){
                
                // Generar una url única
                $hash= md5(uniqid());
                $proyecto->url = $hash;
                
                // Almacenar el creador del proyecto
                $proyecto->propietarioId = $_SESSION["id"];

                $proyecto->guardar();

                header("Location: /proyecto?url=" . $proyecto->url);
            }
        }

        $router->render("dashboard/crear-proyecto", [
            "titulo" => "Crear Proyecto",
            "alertas" => $alertas
        ]);
    }

    public static function proyecto(Router $router){
        session_start();
        isAuth();
        $url = $_GET["url"];
       

        if(!$url) header ("Location: /dashboard");
        
        // Revisar que la persona que visita el proyecto es quien lo creó
        $proyecto = Proyecto::where("url", $url);

        if($proyecto->propietarioId !== $_SESSION["id"]){
            header("Location: /dashboard");
        }

        $router->render("dashboard/proyecto", [
            "titulo" => $proyecto->proyecto
        ]);
    }


    public static function perfil(Router $router) {
        session_start();
        $router->render("dashboard/perfil", [
            "titulo" => "Perfil"
        ]);
    }
}