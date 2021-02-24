'use strict'
// cargar modulos de node para crear el server

var express=require('express');
var bodyparser= require('body-parser');


// ejecutar express
var app= express();

// cargar rutas
var article_router= require('./routes/article.js');

//middlaweres
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//añador pre fijos a rutas /cargar rutas

app.use('/api',article_router);



//exportar modulo(fichero actual)
module.exports=app;