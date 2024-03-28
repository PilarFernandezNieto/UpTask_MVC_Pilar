<?php

namespace Controllers;

use Clases\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {
    public static function login(Router $router) {
        $alertas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $usuario = new Usuario($_POST);
            $alertas = $usuario->validarLogin();

            if(empty($alertas)){
                // Verificar que el usuario exista
                $usuario = Usuario::where("email", $usuario->email);

                if(!$usuario || !$usuario->confirmado){
                    Usuario::setAlerta("error", "El usuario no existe o no está confirmado");
                } else {
                    if(password_verify($_POST["password"], $usuario->password)){
                        session_start();
                        $_SESSION["id"] = $usuario->id;
                        $_SESSION["nombre"] = $usuario->nombre;
                        $_SESSION["email"] = $usuario->email;
                        $_SESSION["login"] = true;

                        header("Location: /dashboard");

                    } else {
                        Usuario::setAlerta("error", "Password incorrecto");
                    }
                }
            }

        }

        $alertas = Usuario::getAlertas();

        $router->render("auth/login", [
            "titulo" => "Iniciar sesión",
            "alertas" => $alertas
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
                    $email->enviarConfirmacion();


                    if ($resultado) {
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

        $alertas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $usuario = new Usuario($_POST);
            $alertas = $usuario->validarEmail();


            if (empty($alertas)) {
                $usuario = Usuario::where("email", $usuario->email);

                if ($usuario && $usuario->confirmado) {

                    // Generar un nuevo token
                    $usuario->crearToken();
                    unset($usuario->password2);

                    // Actualizar el usuario
                    $usuario->guardar();

                    // Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    // Imprimir la alerta
                    Usuario::setAlerta("exito", "Hemos enviado las instrucciones a tu email");
                } else {
                    Usuario::setAlerta("error", "El usuario no existe o no está confirmado");
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render("auth/olvide", [
            "titulo" => "Recupera tu password",
            "alertas" => $alertas
        ]);
    }
    public static function reestablecer(Router $router) {

        $token = s($_GET["token"]);
        $mostrar = true;

        if (!$token) {
            header("Location: /");
        }
        // Identificar al usuario de este token
        $usuario = Usuario::where("token", $token);

        if (empty($usuario)) {
            Usuario::setAlerta("error", "Token no válido");
            $mostrar = false;
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST") {

            // añadir el nuevo password
            $usuario->sincronizar($_POST);

            // Validar el password
            $alertas = $usuario->validarPassword();

            if (empty($alertas)) {
                // hashear el nuevo password
                $usuario->hashPassword();

                // Eliminar el token
                $usuario->token = null;

                // Guardar el usuario
                $resultado = $usuario->guardar();

                // Redireccionar
                if($resultado){
                    header("Location: /");
                }

            }
        }

        $alertas = Usuario::getAlertas();
        $router->render("auth/reestablecer", [
            "titulo" => "Reestablecer password",
            "alertas" => $alertas,
            "mostrar" => $mostrar

        ]);
    }

    public static function mensaje(Router $router) {

        $router->render("auth/mensaje", [
            "titulo" => "Cuenta creada"

        ]);
    }

    public static function confirmar(Router $router) {
        $token = s($_GET["token"]);

        if (!$token) {
            header("Location: /");
        }

        // Encontrar al usuario
        $usuario = Usuario::where("token", $token);
        if (empty($usuario)) {
            Usuario::setAlerta("error", "Token no válido");
        } else {
            $usuario->confirmado = 1;
            unset($usuario->password2);
            $usuario->token = null;

            $usuario->guardar();
            Usuario::setAlerta("exito", "Cuenta confirmada correctamente");
        }

        $alertas = Usuario::getAlertas();

        $router->render("auth/confirmar", [
            "titulo" => "Confirma tu cuenta",
            "alertas" => $alertas
        ]);
    }
}
