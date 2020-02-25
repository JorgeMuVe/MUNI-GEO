
// import Cookies from 'js-cookie';

/*
export const getSession = () => {
  const jwt = Cookies.get('__session')
  let session
  try {
    if (jwt) {
      const base64Url = jwt.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      // what is window.atob ?
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
      session = JSON.parse(window.atob(base64))
    }
  } catch (error) {
    console.log(error)
  }  return session
}

export const logOut = () => {
  Cookies.remove('__session')
}
*/

/* this.state.ROUTE_ENTITY === i.codigoRuteo ? true : false  
selected={this.state.ROUTE_ENTITY === i.codigoRuteo} */

// https://www.w3schools.com/charsets/ref_utf_geometric.asp
// https://www.unicode-search.net/unicode-namesearch.pl?term=CIRCLE

export function checkValidDataSession( ) {
    // const token = localStorage.getItem('tokenUsuario'); // WHY ???
    const tokenPrevioslySaved = sessionStorage.getItem('Cusco.Test.Lois-2020');
    // window.sessionStorage.setItem("key", "value");
    // window.sessionStorage.getItem("key");
    if( tokenPrevioslySaved !== "" && 
        tokenPrevioslySaved !== null && 
        tokenPrevioslySaved !== "undefined" && 
        tokenPrevioslySaved !== undefined ) {
            const data2decode = jwt_decode(tokenPrevioslySaved);
            return {
                idUser : data2decode.codigoUsuario,                
            };
    } else {
        return {};  // false;
    }
}

/* 

                cuentaUsuario : decode.cuentaUsuario,
                nombres : decode.nombres,
                apellidosPaterno : decode.apellidosPaterno,
                apellidosMaterno : decode.apellidosMaterno,
                grupo : decode.grupo,
                firmaDigital : decode.firmaDigital,
                firmaSesion : decode.firmaSesion
*/


/*
var jwt = require("jsonwebtoken");

var token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
var token2 = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

var decode1 = jwt.decode(token1);
var decode2 = jwt.decode(token2);

console.log("without leading space");
console.log(decode1);
// { sub: '1234567890', name: 'John Doe', iat: 1516239022 }

console.log("with leading space");
console.log(decode2);



 var token = response.headers.authorization;
 token = token.replace('Bearer','');
 var jwt = require('jsonwebtoken');
 var decoded = jwt.decode(token);
 console.log(decoded);
 
It may be as simple as removing the extra space that your pasted sample would leave. The authorization header is <scheme><space><value> so:

`var token = token.replace('Bearer ','');`



*/

// AuthService.js
// ... imports
/*
class AuthService {
    login(username, password) {     // We call the server to log the user in.
        return when(request({
            url: ‘http://localhost:3001/sessions/create',
            method: ‘POST’,
            crossOrigin: true,
            type: ‘json’,
            data: {
            username, password
        }
        }))
        .then(function(response) {
        // We get a JWT back.
        let jwt = response.id_token;
        // We trigger the LoginAction with that JWT.
        LoginActions.loginUser(jwt);
        return true;
        });
    }
}

export default new AuthService()
*/