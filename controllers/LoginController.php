<?php

namespace Controllers;

use Clases\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {
    public static function login(Router $router) {

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
        }

        $router->render("auth/login", [
            "titulo" => "Iniciar sesión"

        ]);
    }

    public static function logout() {
        echo "desde logout";
    }

    public static function crear(Router $router) {
        $usuario = new Usuario;
        $alertas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validarNuevaCuenta();

            if (empty($alertas)) {

                // Comprobamos que elusuario no existe
                $existeUsuario = Usuario::where("email", $usuario->email);
                if ($existeUsuario) {
                    Usuario::setAlerta("error", "El usuario ya está registrado");
                    $alertas = $usuario->getAlertas();
                } else {

                    // Hashear el password
                    $usuario->hashPassword();

                    unset($usuario->pasword2);

                    // Crear token para confirmación de cuenta
                    $usuario->crearToken();

                    $resultado = $usuario->guardar();         
                    
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    debuguear($email);
                    if($resultado){
                        header("Location: /mensaje");
                    }
                }
            }
        }

        $router->render("auth/crear", [
            "titulo" => "Crea tu cuenta",
            "usuario" => $usuario,
            "alertas" => $alertas
        ]);
    }
    public static function olvide(Router $router) {

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
        }
        $router->render("auth/olvide", [
            "titulo" => "Recupera tu password"

        ]);
    }
    public static function reestablecer(Router $router) {


        if ($_SERVER["REQUEST_METHOD"] === "POST") {
        }
        $router->render("auth/reestablecer", [
            "titulo" => "Reestablecer password"

        ]);
    }

    public static function mensaje(Router $router) {

        $router->render("auth/mensaje", [
            "titulo" => "Cuenta creada"

        ]);
    }

    public static function confirmar(Router $router) {
        $router->render("auth/confirmar", [
            "titulo" => "Confirma tu cuenta"

        ]);
    }
}
