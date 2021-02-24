'use strict'

var mongoose = require('mongoose');
var app= require('./app');
var port=3900;
mongoose.Promise=global.Promise;
mongoose.set('useFindAndModify',false)
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser:true, useUnifiedTopology: true})
    .then(()=>{
        console.log("conexion correcta!");
        //crear server escuchar peticiones http

        app.listen(port,()=>{
            console.log('server corriendo ');
        })
    });
