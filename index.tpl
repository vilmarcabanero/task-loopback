<!DOCTYPE html>
<html lang="en">
  <head>
    <title>||description||</title>

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="shortcut icon"
      type="image/x-icon"
      href="//v4.loopback.io/favicon.ico"
    />

    <style>
      h3 {
        margin-left: 25px;
        text-align: center;
      }

      a,
      a:visited {
        color: #3f5dff;
      }

      h3 a {
        margin-left: 10px;
      }

      a:hover,
      a:focus,
      a:active {
        color: #001956;
      }

      .power {
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
      }

      .info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .info h1 {
        text-align: center;
        margin-bottom: 0;
      }

      .info p {
        text-align: center;
        margin-bottom: 3em;
        margin-top: 1em;
      }
    </style>
  </head>

  <body>
    <div class="info">
      <!-- name -->
      <h1>||name||</h1>

      <!-- version -->
      <p>Version ||version||</p>

      <h3>OpenAPI spec: <a href="/openapi.json">/openapi.json</a></h3>
      <h3>API Explorer: <a href="explorer">explorer</a></h3>
    </div>

    <footer class="power">
      <a href="https://v4.loopback.io" target="_blank">
        <img
          src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png"
        />
      </a>
    </footer>
  </body>
</html>
