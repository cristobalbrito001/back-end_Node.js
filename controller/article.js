'use estrict'
var validator = require('validator');
const article = require('../models/article');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
const { exists } = require('../models/article');
var controller = {

    datosCurso:(req,res)=> {
        var hola= req.body.hola
        return res.status(200).send({
            
            curso:'js',
            autor:'cris',
            url:'home',
            hola
        });
    },
    test: (req,res)=>{
        return res.status(200).send({
            message:'soy la accion test del controlador de articulos '
        });
    },
    save: (req,res) =>{
        //recojer parametros por post
        var params = req.body;
        console.log(params);

        //validar datos()validator
        try{
            var validate_tittle=!validator.isEmpty(params.title)
            var validate_content=!validator.isEmpty(params.content)
        }catch(err){
            return res.status(200).send({
                status:'error',
                message:'faltan datos por enviar!!!'
                
             })
         }

         if(validate_tittle && validate_content){

            // crear objeto a guardar
            var article=new Article();

                // asirnar valores

                   article.title=params.title;
                   article.content=params.content;
                    if(params.image){
                        article.image = params.image;
                    }else{
                        article.image= null;
                    }
                   

                //guardar articulo

                article.save((err,articleStored)=>{
                    if(err || !articleStored){
                        return res.status(404).send({
                            status:'error',
                            message:'articulo no se ha guardado'
                            
                         })
                    }
                    //devolver respuesta
                return res.status(200).send({
                    status:'access',
                    article:articleStored
                        
                });
                });

              
               
         }else{
             status:'error';
             message:'datos no validos';
         }
         
       
    },

    getArticles: (req,res) =>{

        var query=Article.find({})
        var last= req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }
        // find
        query.find({}).sort('-_id').exec((err,article)=>{
           
           if(err){
            return res.status(500).send({
                status:'error',
                message:'error al devolver articulos'
            })
               
           }
           if(!article){
               return res.status(404).send({
                status:'error',
                message:'no hay articulos'
               })
               
           }
           
            return res.status(200).send({
            
                status:'access',
                article
                
             })
        })
        
     },

     getArticle:(req,res)=>{
        
        //recoger el id de la url
        var articleID= req.params.id;
        //comprobar si existe

        if(!articleID  || articleID == null){
            console.log(articleID);
            return res.status(404).send({
                status:'error',
                message:'no hay articulos'
            })
        }


        Article.findById(articleID, (err, article) => {
                if (err || !article) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'no hay articulos existente'
                    });
                }

                return res.status(200).send({
                    status: 'exito',
                    article
                });
            }) 
     },

     update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            }); 
        }

        if(validate_title && validate_content){
             // Find and update
             Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
             });
        }else{
             // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
       
    },

    delete:(req,res)=>{
        //recojemos el id por url
        var articleId = req.params.id;

        //find and delete

        Article.findOneAndDelete({_id:articleId}, (err, articleRemoved)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error del servidor'
                });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'error articulo no encontrado'
                });
            }

            return res.status(200).send({
                status: 'EXITO',
                article: articleRemoved
            });

        })



    },


    upload:(req, res)=>{

        //configurar el modulo del connect multiparty/ router/article.js

        //recojer el fichero

        var file_names = 'imagen no subida..';

        if(!req.files){
            return res.status(404).send({
                status:'error',
                message:file_names                
            });
        }


        //consegir el nombre y la extension del archivo

        var file_path=req.files.file0.path;
        var file_split=file_path.split('\\');

        //nombre del archivo
        var file_name=file_split[2];

        // extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext= extension_split[1];

        //comprobar la extension, si no es valida borraer el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'  ){
            //borrar el archivo
            fs.unlink(file_path, (err)=>{
                return res.status(500).send({
                    status:'error',
                    message:'la extension no es valida'                
                 });
            })
        }else{
            // busar el articulo y asignarle nombre de la imagen y actulizarle
            var articleId = req.params.id;
            if(articleId){
                Article.findOneAndUpdate({_id:articleId}, {image:file_name},{new:true},(err,articleUpdated)=>{
                    if(err || !articleUpdated){
                     return res.status(404).send({
                         status:'error',
                         message:'error al subir archivo'                
                      });
                    }
                     return res.status(200).send({
                         status:'succes',
                         message: articleUpdated                
                      });
                 });
            }else{
                return res.status(200).send({
                    status:'succes',
                    image: file_name                
                 });
            }
            


            
        }
    },
     
        getImage:(req,res)=>{

            var file = req.params.image;
            var path_file='./upload/articles/'+file;

            fs.exists(path_file,(exists)=>{
                if(exists){
                    return res.sendFile(path.resolve(path_file));
                }else{
                    return res.status(404).send({
                        status:'error',
                        message: 'la image no existe '                
                     });
                }
            })
           
        },



        search: (req, res) => {
            // Sacar el string a buscar
            var searchString = req.params.search;
    
            // Find or
            Article.find({ "$or": [
                { "title": { "$regex": searchString, "$options": "i"}},
                { "content": { "$regex": searchString, "$options": "i"}}
            ]})
            .sort([['date', 'descending']])
            .exec((err, articles) => {
    
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }
                
                if(!articles || articles.length <= 0){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda !!!'
                    });
                }
    
                return res.status(200).send({
                    status: 'success',
                    articles
                });
    
            });
        }

};//end controller
module.exports=controller;
