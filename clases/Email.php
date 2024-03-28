<?php
namespace Clases;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;


class Email  {
    protected $email;
    protected $nombre;
    protected $token;

    public function __construct($email, $nombre, $token){
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion(){
        $mail = new PHPMailer();
        //$mail->SMTPDebug  = 2;
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '6e95664bc84cd5';
        $mail->Password = '1afea68a03c439';


        $mail->setFrom("cuentas@uptask.com");
        $mail->addAddress("cuentas@uptask.com", "uptask.com");
        $mail->Subject = "Confirma tu cuenta";
        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has creado tu cuenta en UpTask, solo debes confirmarla en el siguiente enlace</p>";
        $contenido .= "<p>Presiona aquí: <a href='http://localhost:3000/confirmar?token=" . $this->token . "'>Confirmar cuenta</a></p>";
        $contenido .= "<p>Si no has creado esta cuenta, puedes ignorar este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        $mail->send();
    }

    public function enviarInstrucciones() {
        $mail = new PHPMailer();
        //$mail->SMTPDebug  = 2;
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '6e95664bc84cd5';
        $mail->Password = '1afea68a03c439';


        $mail->setFrom("cuentas@uptask.com");
        $mail->addAddress("cuentas@uptask.com", "uptask.com");
        $mail->Subject = "Reestablece tu password";
        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Parece que has olvidado tu password. Sigue el siguiente enlace para recuperarlo.</p>";
        $contenido .= "<p>Presiona aquí: <a href='http://localhost:3000/reestablecer?token=" . $this->token . "'>Reestablecer password</a></p>";
        $contenido .= "<p>Si no has solicitado ese cambio, puedes ignorar este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        $mail->send();
    }
}