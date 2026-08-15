# language: es

Característica: Gestión de obras
   Escenario: recuperar lista de obras
      Dado que existe la obra "Hamlet"
      Y que existe la obra "Othello"
      Y que existe la obra "As You Like It"
      Cuando solicitamos recuperar la lista de obras
      Entonces esperamos recibir estado 200
      Y el mensaje de respuesta "OK"
      Y los siguientes datos:
         """
         [{
            "code": "hamlet",
            "name": "Hamlet",
            "type": "tragedy"
         },{
            "code": "as-like",
            "name": "As You Like It",
            "type": "comedy"
         },      
         {
            "code": "othello",
            "name": "Othello",
            "type": "tragedy"
         }]
         """

   Esquema del escenario: Recuperar una obra
      Dado que existe la obra "<codigo>"
      Cuando solicito recuperar la obra con "<codigo>"
      Entonces esperamos recibir estado <estado>
      Y el mensaje de respuesta "<mensaje>"
      Y la obra con "<codigo>", "<nombre>", "<tipo>"

      Ejemplos:
      | codigo | nombre | tipo | estado | mensaje |
      | hamlet | Hamlet | tragedy | 200 | Obra recuperada correctamente |
      | othello | Othello | tragedy | 200 | Obra recuperada correctamente |
      | as-like | As You Like It | comedy | 200 | Obra recuperada correctamente |
      | romjul | Romeo y Julieta | tragedy | 404 | Obra no existe |
   
   Esquema del escenario: Actualizar una obra
      Dado que existe la obra "<codigo>"
      Cuando solicito cambiar el nombre "<nuevo_nombre>" de la obra con "<codigo>"
      Entonces esperamos recibir estado <estado>
      Y el mensaje de respuesta "<mensaje>"
      Y la obra con "<codigo>", "<nuevo_nombre>", "<tipo>"

      Ejemplos:
      | codigo  | nombre | nuevo_nombre    | tipo    | estado | mensaje                        |
      | hamlet  | Hamlet | Jamlet          | tragedy | 200    | Obra actualizada correctamente |
      | hamlet  | Jamlet | Hamlet          | tragedy | 200    | Obra actualizada correctamente |
      

