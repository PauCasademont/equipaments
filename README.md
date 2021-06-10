# Sistema interactiu del consum d'energia en els equipaments públics a Girona

Aquesta aplicació web serveix per visualitzar i comparar les  dades del consum energètic dels equipametns públics de Girona amb gràfics. Proporciona una eina de benchmarking als administradors d'equipaments i regidors de l’Ajuntament de Girona com a base de suport a la presa de decisions  del comportament energètic en els equipaments públics.

Es accedir a la web mitjançant el següent enllaç: http://equipaments.catedragironasmartcity.cat/




## Coneixements necessaris

Per comprendre el codi, editar-lo o afegir noves funcionalitats cal haver assumit els següents coneixements:
- Coneixer els diferents tipus de peticions HTTP (get, patch, delete, post).
- Nocions bàsiques de programació web amb JavaScript, HTML i CSS.
- Entendre el funcionament i el cicle de vida dels hooks ***UseEffect*** i ***UseState*** de React.
- Saber utilitzar components de [MaterialUI]: https://material-ui.com/ , especialment el component [Grid]: https://material-ui.com/components/grid/

## Instalació pel desenvolupament

### Requeriments 
- Node v14 o superior

### Crear entorn
Abans d'executar el codi si es descarrega localment s'han seguir següents passos:
- Instalar les dependències: s'ha d'executar la comanda ***npm i*** o ***npm install*** des d'un terminal amb node, dins el directoris [client]: https://github.com/PauCasademont/equipaments/tree/main/client i [server]: https://github.com/PauCasademont/equipaments/tree/main/server.
- Crear el fitxer .env dins al directori servidor amd les variables (el fitxer [.env.example]: https://github.com/PauCasademont/equipaments/blob/main/server/.env.example mostra com han de ser les variables):
    - CONNECTION_URL: 'enllaç de connexio amb la base dades de MongoDB'
    - CLIENT_SECRET: 'clau secreta que servirà per autentificar els usuaris, pot ser cualsevol string però es recomana un mínim de 16 caracters aletoris per seguratat'

### Execució
Per executar el client cal executar la comanda ***npm start*** dins el directori [client]: https://github.com/PauCasademont/equipaments/tree/main/client
Per executar el servidor cal executar la comanda ***npm start*** dins el directori [server]: https://github.com/PauCasademont/equipaments/tree/main/server.

NOTA: Si s'utilitza el client localment, també caldra iniciar le servidor perquè funcioni.


## Estructura de directoris

En aquest apartat la funcionalitat de cada directori de l'aplicació.

### Client

- [public]: https://github.com/PauCasademont/equipaments/tree/main/client/public : conté l'HTML arrel per definir la pàgina (no s'hauria d'editar)
- [src]: https://github.com/PauCasademont/equipaments/tree/main/client/src : hi ha el codi amb React
    - [actions]: https://github.com/PauCasademont/equipaments/tree/main/client/src/actions : representa el controlador de les accions del client. Tracta les peticions que envia al servidor i les dades que retorna als components amb el format adient, perquè hi hagi el mínim de lògica en el codi dels components. 
    - [api]: https://github.com/PauCasademont/equipaments/tree/main/client/src/api : defineix les peticions que es poden enviar del servidor.
    - [components]: https://github.com/PauCasademont/equipaments/tree/main/client/src/components : conté els components amb React. Estan agrupats en directoris segons el tipus. Els noms de components sempre comencen amb majúscula i en el mateix directori es pot trobar el fitxer d'etils .css del component i directoris amb subcomponents d'aquest si en té. 
    - [constants]: https://github.com/PauCasademont/equipaments/tree/main/client/src/constants : conté un fitxer que guarda les variables constants de l'aplicació.
    - [images]: https://github.com/PauCasademont/equipaments/tree/main/client/src/images : conté les imatges de la web.
    - [App.js]: https://github.com/PauCasademont/equipaments/blob/main/client/src/App.js : és el component principal de react. Defineix les rutes de l'aplicació.
    - [index.js]: https://github.com/PauCasademont/equipaments/blob/main/client/src/index.js : fitxer que renderitza l'aplicació al cos de l'HTML arrel.

### Servidor

- [controllers]: https://github.com/PauCasademont/equipaments/tree/main/server/controllers : conté la lògica de totes les peticions HTTP
- [middleware]: https://github.com/PauCasademont/equipaments/tree/main/server/middleware : conté les funcions de middleware. L'única funció que hi ha és la d'autentificació de l'usuari.
- [models]: https://github.com/PauCasademont/equipaments/tree/main/server/models : defineix el format dels documents de la base de dades MongoDB.
- [router]: https://github.com/PauCasademont/equipaments/tree/main/server/routes : defienix les rutes HTTP i les enllaça amb les funcions de middleware i controllers.
- [index.js]: https://github.com/PauCasademont/equipaments/blob/main/server/index.js : és el fitxer que inicia el servidor i crea la connexió amb la base de dades.


## Base de dades

Aquesta aplicació utilitza [MongoDB_Atlas]: https://www.mongodb.com/cloud/atlas per guardar i hostejar les dades. 

### Documents

Hi ha dos tipus de documents diferents, un per les dades dels equipaments i l'altre pels usuaris. A continuació es mostra el format d'aquests documents.

- **public_facilities**
    - _id: identificador de l'equipament.
    - name: nom de l'equipament.
    - coordinates: llista amb dos decimals. [latitud, longitud].
    - area: superfície en m2.
    - typology: tipologia.
    - users: llista amb els noms dels usuaris administradors de l'equipament.
    - data: objecte amb les dades de consum de l'equipaments.

Les claus de l'objecte data són els conceptes. Cada concepte conté un objecte on les claus són els anys de les dades. Per cada any hi han dos tipus de dades, consum i preu del consum. Aquestes dades estan representades amb llistes de 12 valors, cada valor representa un mes de l'any.

Exemple: 
    data: {
        Total: {
            2019: {
                consumption: Array(12),
                price: Array(12)
            },
            2018: { ... }
        },
        Electricitat: { ... }
    }

- **users**
    - _id: identificador de l'usuari.
    - public_facility_ids: llista amb els identificadors dels equipaments que té assignats. L'administrador de l'aplicació no té aquest camp.
    - is_admin: booleà que indica si és l'administrador de l'aplicació.
    - password: contrasenya encriptada.

### Enllaç de contexió amb el servidor

El servidor per contectar-se amb la base de dades necessita un codi de connexió. Es pot trobar dins la web l'Atlas, dins la base de dades del projecte, a l'apartat de clusters, cal apretar el botó *connect* i després *connect your aplication*. El driver que s'ha de seleccionar es Node.js, que està per defecte, i a continuació es mostrarà l'enllaç per copiar-lo.

Exemple del codi de connexió:
*mongodb+srv://Admin:<password>@clusterequipaments.maukd.mongodb.net/<database>?retryWrites=true&w=majority*
Canviant <password> per la contrasenya de l'administrador i <database> pel nom de la base de dades.

Guia de l'Atlas: [SetUpAtlasConnectivity]: https://docs.mongodb.com/guides/cloud/connectionstring/

### Backups i Imports

Per poder fer les copies de seguretat i tornar a importar les dades, cal tenir instalat [MongoDB_Tools]: https://www.mongodb.com/try/download/database-tools

Per fer els backups s'ha d'executar la següent comanda des de qualsevol terminal:

mongoexport --db <DB_NAME> --collection <COLLECTION_NAME> --out <PATH_FILE> 
--dir <CONNECTION_URL>

Canviant:
- <DB_NAME> per el nom de la base de dades.
- <COLLECTION_NAME> per el nom dels documents (public_facilities o users).
- <PATH_FILE> ubicació on es guardarà el backup. L'extensió del fitxer pot ser json o csv.
- <CONNECTION_URL> enllaç de connexió (veure l'apartat anterior per trobar-lo).

Per importar els backups s'ha d'executar la següent comanda des de qualsevol terminal:

mongoimport --uri <CONNECTION_URL> --collection <COLLECTION_NAME> --type <FILE_TYPE> --file <FILE_PATH>

Canviant:
- <CONNECTION_URL> enllaç de connexió (veure l'apartat anterior per trobar-lo).
- <COLLECTION_NAME> per el nom dels documents (public_facilities o users).
- <FILE_TYPE> tipus de fitxer, pot ser JSON o CSV (en majúscules).
- <PATH_FILE> ubicació on es guardarà el backup. L'extensió del fitxer pot ser json o csv.

## Usuaris

En aquesta aplicació es poden diferenciar 3 tipus d'usuaris diferents:
- Usuari no registrat: té permisos per visualitzar, comparar, filtrar i extreure les dades de tots els equipaments.
- Usuari registrat: té permisos per afegir i modificar les dades dels equipaments que te assignats.
- Administrador: Afegir i modificar les dades de tots els equipaments, importar el fitxer de dades de l'ajuntament, crear i eliminar equipaments.

Només l'usuari administrador pot registrar nous usuaris a l'aplicació, a través de la finestra de configuració d'usuaris. Les contrasenyes es guardaran de manera encriptada i l'usuari registrat la podrà modificar.

La web no disposa d'una funcionalitat per crear un nou usuari administrador, ja que només n'hi hauria d'haver un. Si es vol editar o crear un nou administrador s'ha d'accedir a la base dades de MongoDB i crear un nou usuari administrador amb els següents camps:
- username: 'nom de l'usuari'
- is_admin: true
- password: 'contrasenya encriptada'

Per encriptar la contrasenya s'utilitza la llibreria bcryptjs amb 12 rondes. Es pot utlitzar la web [bcrypt-generator]: https://bcrypt-generator.com/ per encriptar.

## Contacte

Per qualsevol dubte sobre el disseny o implementació del codi, us podeu posar en contacte amb l'autor a través del correu: casademont13@gmail.com