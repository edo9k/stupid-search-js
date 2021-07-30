# Stupid Search JS

Rudimentary and stupid simple text search put together with javascript's string functions. This is supposed to run both on Node and on the frontend. Let's see how it goes.

On the fronend it should return the text around the occurence with a link (anchor or whatever) that lets the user click/tap on it and be ddirected to the that specific part of the text. If possible, without reliance on ids, classes or anything like that. Should also redirect across several html/php/jsp/what-not pages.

## running the examples 

### node version


Just open the ./node folder and run `node main.js "pesquisa"`, **pesquisa** being the word or sentences you're looking for.

### web version

Open the ./vanilla folder and start a web server (with php you can do it with `php -S localhost:8000`).

Access with a web browser, in this example the search is right on the home page (`index.html` file).

