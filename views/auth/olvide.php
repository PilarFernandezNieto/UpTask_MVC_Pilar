<div class="contenedor olvide">
    <?php include_once __DIR__ . "/../templates/nombre-sitio.php"; ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Recuperar Password</p>
        <?php include_once __DIR__ . "/../templates/alertas.php"; ?>

        <form action="/olvide" class="formulario" method="POST">
            <div class="campo">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Tu Email">
            </div>
            <input type="submit" class="boton" value="Recuperar">

        </form>
        <div class="acciones">
            <a href="/crear">¿Aún no tienes una cuenta? Obtener una</a>
            <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
        </div>
    </div> <!-- CONTENEDOR-SM -->
</div> <!-- CONTENEDOR -->