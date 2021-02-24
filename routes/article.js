'use strict'
var express=require('express');

var ArticleController= require('../controller/article');

var router= express.Router();

var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir:'./upload/articles'});


//rutas de prueba
router.post('/datos-curso',ArticleController.datosCurso);
router.get('/test-de-contralador',ArticleController.test);


//rutas utiles
router.post('/save-articulo',ArticleController.save);
router.get('/articulo/:last?',ArticleController.getArticles);
router.get('/articulo-de-uno/:id',ArticleController.getArticle);
router.put('/articulo/:id',ArticleController.update);
router.delete('/articulo/:id',ArticleController.delete);
router.post('/articulo-image/:id?',md_upload,ArticleController.upload);
router.get('/image/:image',ArticleController.getImage);
router.get('/search/:search',ArticleController.search);

module.exports=router;