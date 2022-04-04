

ready(function () {

    console.log("Client script loaded.");

    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                //console.log('responseText:' + xhr.responseText);
                callback(xhr.responseText);

            } else {
                console.log(xhr.status);
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    function ajaxPOST(url, callback, data) {

        /*
         * - Keys method of the object class returns an array of all of the keys for an object
         * - The map method of the array type returns a new array with the values of the old array
         *   and allows a callback function to perform an action on each key
         *   The join method of the arra type accepts an array and creates a string based on the values
         *   of the array, using '&' we are specifying the delimiter
         * - The encodeURIComponent function escapes a string so that non-valid characters are replaced
         *   for a URL (e.g., space character, ampersand, less than symbol, etc.)
         *
         *
         * References:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
         */
        let params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');
        console.log("params in ajaxPOST", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            console.log(xhr.readyState);
            console.log(xhr.status);
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                callback(xhr.responseText);

            } else {
                console.log(xhr.status);
            }
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // POST TO THE SERVER
    document.querySelector("#submit").addEventListener("click", function (e) {
        e.preventDefault();
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let queryString = "email=" + email.value + "&password=" + password.value;
        //console.log("data that we will send", email.value, password.value);
        const vars = { "email": email, "password": password }
        
        ajaxPOST("/login", function (data) {
            if (data) {
                console.log(data);
                let dataParsed = JSON.parse(data);
                if (dataParsed.status == "fail") {
                    document.getElementById("errorMsg").innerHTML = dataParsed.msg + " user or password!";
                } else {
                    window.location.replace("profile");
                }
            }
        }, queryString);
    });

});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}


// ready(function () {

//     console.log("Client script loaded.");

//     // a function declaration inside of a callback ... which takes a callback function :O
//     function ajaxGET(url, callback) {

//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//                 //console.log('responseText:' + xhr.responseText);
//                 callback(this.responseText);

//             } else {
//                 console.log(this.status);
//             }
//         }
//         xhr.open("GET", url);
//         xhr.send();
//     }

//     document.querySelectorAll(".clear").forEach(function (currentElement, currentIndex, listObj) {
//         //console.log(currentElement, currentIndex, listObj);
//         currentElement.addEventListener("click", function (e) {

//             for (let i = 0; i < this.parentNode.childNodes.length; i++) {
//                 if (this.parentNode.childNodes[i].nodeType == Node.ELEMENT_NODE) {
//                     if (this.parentNode.childNodes[i].getAttribute("class") == "ajax-stuff") {
//                         this.parentNode.childNodes[i].innerHTML = "";
//                         break;
//                     }
//                 }
//             }

//         });
//     });

//     document.querySelector("#stocksJSON").addEventListener("click", function (e) {
//         ajaxGET("/stocks?format=json", function (data) {
//             console.log("Before parsing", data);
//             // this call is JSON so we have to parse it:
//             let parsedData = JSON.parse(data);
//             console.log("Before parsing", parsedData);
//             let str = "<ol>"
//             for (let i = 0; i < parsedData.length; i++) {
//                 str += "<li>" + parsedData[i] + "</li>";
//             }
//             str += "</ol>";
//             document.getElementById("stocks-json").innerHTML = str;
//         });
//     });

//     document.querySelector("#stocksHTML").addEventListener("click", function (e) {
//         ajaxGET("/stocks?format=html", function (data) {
//             console.log(data);
//             // since it's HTML, let's drop it right in
//             document.getElementById("stocks-html").innerHTML = data;
//         });
//     });

//     // let's wire our ajax call function to an mouse click so we get data
//     // when the user clicks
    

// });

// // process the callback function
// function ready(callback) {
//     if (document.readyState != "loading") {
//         callback();
//         console.log("ready state is 'complete'");
//     } else {
//         document.addEventListener("DOMContentLoaded", callback);
//         console.log("Listener was invoked");
//     }
// }

