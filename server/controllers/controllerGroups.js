'use strict'

const redis = require('redis')
var events = require('events');
var eventEmitter = new events.EventEmitter();
const client = redis.createClient()
const multer = require('multer') // Modulo para el manejo de archivos, crear, mover, eliminar, renombrar etc


// no usado
/*const io = require('socket.io-client');

const serverUrl = 'http://localhost:3000';
const conn = io.connect(serverUrl);
*/
module.exports = (app) => {

    const auth = app.middlewares.auth  // Llamada del middleware para la validacion de las rutas
            , find = app.middlewares.find  // Llamada del middleware para la busqueda
            , validate = app.middlewares.validations  // Llama al middleware para las validaciones

    const io = require("socket.io")
    const Group = app.models.modelGroups
    const User = app.models.modelUsers

    //TODO decada método se pude ver que campos de la base de datos no son necesatrio retornar ...
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/imagesPublications/')  // URL donde se almacenan las imagenes
        },
        filename: function (req, file, cb) {
            cb(null, 'imageSource-' + Date.now() + '.' + file.originalname.split('.').pop())  // Renombra el archivo, despues lo mueve
        },
        onError: function (error, next) {
            console.log(`\n[[controllerGroups.storage]: Ups hay un error => ${error}`)
            next(error)
        }
    })
        , upload = multer({ storage: storage })  // Usa el storage especificado con anterioridad


    this.setGroup = (req, res) => {
        ///let ext_ = req.files.image.name.split(".").pop()
        if(req.body)   {
            console.log("[controllerGroups.set] Group ", JSON.stringify(req.body))}

        let newGroup = new Group({
            name      : req.body.nameCommunity,
            description      : req.body.descriptionCommunity,
            category      : req.body.categoryCommunity,
            subcategory      : req.body.subcategoryCommunity,
            privacy   : req.body.privacyCommunity // Public / private
            //creator      : 'id_creator',
            // contact       : 'id_contact', // todo usar id de cada esquema para relacionarlo
            // creator       : 'id_creator'
        })
        console.log("[controllerGroups.set] Privacy ", req.body.privacyCommunity)

        newGroup.save(err => {
            if (err) {
                console.log(`[controllerGroups.set] Error group no almacenada ${err}`)
                res.redirect('/community')
            }
            //fs.rename(req.files.image.path, "public/images/imagesGroup/" + newGroup._id + "." + ext_)
            console.log('[controllerGroup.set]  Grupo CREADOO  con exito')
            res.redirect('/community')
            //res.status(200).send({newGroup: newGroup})
        })
    }


    this.getGroups = (req, res) => {

        Group.find({}, (err, storedGroups) => {
            if(err) {
                console.log(` [controllerGroups.get] Error al buscar todo grupo ${err}`)
                res.status(300).send({error: err})
                //res.redirect('/groups')
            }
            //res.status(400).send({groups: storedGroups})

            let adminsPopulate = {
                                    path: "members", // miembros
                                    //match: {isAdmin: {$in: [false] } },  // condicion  Admin como true
                                    select : "-password -provider -administrator" // Campos a excluir del usuario
            }

            User.populate(storedGroups, adminsPopulate, (err, storedGroups) => {

                if(err) {
                    console.log(`[controllerGroups.getGrouP]   Error al buscar  group ${err}`)
                }


                if (req.xhr) { // Si la petición es AJAX devuelve solo los satos solicitados
                    console.log("XHRR ---")
                    res.status(200).send(storedGroups)
                }
                else{ // Si no, renderizar página completa
                    console.log("FULL GET")
                    res.render('communities', {
                        groups: storedGroups,

                        user    : req.user,
                        err     : req.flash('err'),

                        warning : req.flash('warning'),
                        info    : req.flash('info'),
                        success : req.flash('success')
                    })

                }



            });


            //res.render('./viewsUserPlus/groups/index', {groups: storedGroups})
        })
    }


    this.subsTo = (req, res) =>{

        let group = req.params.groupId;

        console.log("[controllerGroup.subTo] Subscribe group.toString()");
        //client.subscribe('58d1a19621b3e007f4230909');
        //client.publish('subscriptions', group.toString() ) // DO   --> realtimeGroups.js
        client.publish('subscriptions', '58d1a19621b3e007f4230909_Redis' ) //

        res.status(200).send({group: group})
    }


    this.getGroup = (req, res) => {
    var groups2 = ['gpo1', 'gpo2', 'gpo3']
    client.sadd(['grupos3', groups2 ], function(err, reply) { // TODO Agregar grupos del usuario ada vez que entre
                console.log("[controllerGroups.getGroup] GRUPOS SETEADOS ", reply);
                ///res.status(200).send({message: 'done set', reply})
    })

        var auth = req.get('Authorization');

        eventEmitter.emit('messageGroup', {
                req: req,
                res: res,
                auth: auth
            }
        )

        //console.log('claves ######<## ', (req.user.id), 'feff' );

        //let groupId
        let usersSt = {}
        User.find({}, (err, storedUsers) => { // Obtener usuarios para agregr grupos TODO de momento son todos ...
            if(err) {
                console.log('=========================================================')
                console.log(`[groupsCrud/getGroups]: Error al recuperar todos los usuarios guardados ${err}`)
                console.log('=========================================================')
            }
            usersSt = storedUsers
        })

        Group.findById(req.params.id, (err, storedGroup) => {

            /*io.sockets.on("connection", function (socket) {
                var self = this;
                socket.join("58d1a19621b3e007f4230909");  /// ********* Groups
                socket.join("58d862d41e8ff619c41b3b80");  /// ********* Groups
            })*/


            if(err) {
                console.log(`[getGrouP]   Error al buscar  group ${err}`)
                res.redirect('/groups')
            }

            let adminsPopulate = {
                                    path: "members", // miembros
                                    select : "-password -provider -administrator" // Campos a excluir del usuario

                                    //match: {isAdmin: {$in: [false] } }  // condicion  Admin como true
                                }

            User.populate(storedGroup, adminsPopulate, (err, storedGroup) => {

                if(err || !storedGroup) {
                    console.log(`[getGrouP]   Error al buscar  group ${err}`)
                }
                //res.status(200).send(storedGroup);
                //console.log("/////// Group ----- " + storedGroup +" ------------");
                let room = "ROOM !!!!1";
                let message = "Emitido al room  !!!!1";
                /*
                let myObj   = client; //{myFn : function() {}, tamato: true};
                let allKeys = Object.keys(myObj);
                console.log("--------------------------KEY---------------------------");
                console.log(allKeys);

                let fnKeys  = allKeys.filter(key => typeof myObj[key] == 'function');
                console.log("--------------------------KEY---------------------------");
                console.log(fnKeys);
                console.log("--------------------------KEY---------------------------");
                */
                //client.in(room).emit('message', { room: room, message: message });
                ///client.sockets.in(room).emit('new msg to client', data)
                //console.log(Object.keys(storedGroup), '--------------- ');
                message = {
                    messageTo: "[getGrouP] Se publico en el canal  CTRLR "  + storedGroup['_id'],
                }

                //client.subscribe(storedGroup['_id'].toString())  //// // TODO     NO vaaqui

                client.publish('subscribe', 'groupSocketIO')
                client.publish('groupRedis', JSON.stringify(message))

                //console.log('Ennnnviarrrr ',  JSON.stringify(message));
                message = {
                    messageTo: "-------- Entrar A AAAA  "
                }

                client.emit('subscribe', 'groupSocketIO') // deprecated, dont exist TODO

                    // client.publish('message', JSON.stringify(message))
                    // client.publish(storedGroup['_id'].toString(), JSON.stringify(message) ) //  descomen

                /*client.publish('notiToGroup', JSON.stringify(message) )
                client.publish('58d1a19621b3e007f4230909', JSON.stringify(message) )*/


                //res.render('./viewsUserPlus/groups/view', {group: storedGroup,  users: usersSt})
                res.status("200").send({group: storedGroup,  users: usersSt})
            });
        })

    }


    this.notiToGroup = (req, res) => { // notify to group // validar: isMemberGroup
        let groupId = req.params.groupId
        /*console.log( " LKeys notif Groups ", Object.keys(req.params))
        console.log( " LKeys notif Groups ", Object.keys(req.body))*/
        //let message = req.body.message

        var message = {
            room : req.body.room,
            message : req.body.message,
            type: 'message',
        }

        console.log("body room ", req.body.room);

        console.log('****************** grupo', groupId);
        console.log('****************mensaje del input', message);

        console.log("ID GRUPO   ", groupId);

        console.log(typeof message)


        client.publish('notiToGroup', message['message'] )
        client.publish('58d1a19621b3e007f4230909_Redis', JSON.stringify(message) ) // Room y message
        //client.publish('58d1a19621b3e007f4230909_Redis', message['message'] )
        // io.sockets.in(room).emit('message', { room: room, message: message }); con IO

        res.status(200).send({ groupId: groupId})

        //res.end('{"success" : "Updated Successfully", "status" : 200}')
    /*
        Group.findById(groupId, (err, storedGroup) => {

            client.publish(storedGroup['_id'].toString(), JSON.stringify(message) ) //  descomen

            if(err) {
                console.log(`[notiToGroup]   Error al buscar  group ${err}`)
                res.redirect('/groups')
            }

            let adminsPopulate = {
                                    path: "members", // miembros
                                    select : "-password -provider -administrator" // Campos a excluir del usuario
                                    //match: {isAdmin: {$in: [false] } }  // condicion  Admin como true
                                 }

            User.populate(storedGroup, adminsPopulate, (err, storedGroup) => {

                if(err) {
                    console.log(`[getGrouP]   Error al buscar  group ${err}`)
                }
                //res.status(200).send(storedGroup);
                console.log("/////// Group ----- " + storedGroup +" ------------");
                let room = "ROOM !!!!1";
                let message = "Emitido al room  !!!!1";

                console.log(Object.keys(storedGroup), '--------------- ');
                message = {
                    message: "Se publico en el canal  CTRLR "  + storedGroup['_id'],
                }

                //client.subscribe(storedGroup['_id'].toString())  //// // TODO     NO vaaqui
                client.publish(storedGroup['_id'].toString(), JSON.stringify(message) ) //  descomen

                res.render('./viewsUserPlus/groups/view', {group: storedGroup,  users: usersSt})
            });
        })*/

    }


    this.updateGroup = (req, res) => {

        Group.findById(req.params.id, (err, storedGroup) => {
            if(err) {
                console.log(` [controllerGoups/updateGroup] Error al buscar el grupo ${err}`)
                res.redirect('/groups')
            }
            storedGroup.name      = req.body.nameCommunity
            storedGroup.description      = req.body.descriptionCommunity
            storedGroup.category      = req.body.categoryCommunity
            storedGroup.subcategory      = req.body.subcategoryCommunity
            storedGroup.privacy   = req.body.privacyCommunity
            /*if (req.files.image.name != "") {
              //  let ext_ = req.files.image.name.split(".").pop()
                /*fs.unlink("public/images/imagesGroup/" + storedGroup.image)
                fs.rename(req.files.image.path, "public/images/imagesGroup/" + storedGroup.image)*/
        //}

            storedGroup.save(err => {
                if (err) {
                    console.log(`  [ctrlGroups/updateGroup] Error al actualizar los datos ${err}`)
                    res.redirect('/groups')
                }
                res.redirect('/groups')
            })
        })
    }


    this.deleteGroup = (req, res) => {
        Group.findOneAndRemove({_id: req.params.id}, (err, storedGroup) => {
            console.log(" [ctrlGroups/deleteGroup] [Eliminar]", req.params.id)
            if (err) {
                console.log(` [ctrlGroups/deleteGroup]  Error al eliminar los datos ${err}`)
                //res.redirect('/groups')
                res.status(500).send({message: "Hubo un error en el server"});
            }
            //fs.unlink("public/images/imagesGroup/" + storedGroup.image)
            //res.redirect('/community')

            //res.render('community', {message: "Eliminado correctamente"})
            res.status(200).send({storedGroup, message: "Eliminado correctamente"});
        })
    }


    /*/**************Operacion es sobre miembros y Requests */////////////
    this.addMemberToGroup = (req, res) => {
        console.log(req.params.groupId +" [ctrlGroups/addMemberToGroup] ------------------------------");
        console.log(req.params.userId +"[ctrlGroups/addMemberToGroup] -----IDUSR -------------------------");
        let groupId = req.params.groupId;
        let userId = req.params.userId;
        let update = req.body;

        Group.findOneAndUpdate(
            { _id: groupId },
            { $push: { members: {user: userId} } }, // addToSet allow insert only if same element in the array !exist

            /*{ $push: {  // Datos a Actualizar
                 requests: {sendBy: userId},
                 comment: comment }
            },*/
            //{upsert: true}, /// crea el elemento ... si no existe

            function(err, groupUpdated) {
                if (err) {
                  return res.status(500).send({message: 'Error en DateB ' + err});
                }
                console.log("[ctrlGroups/addMemberToGroup] Miembro gregado al grupos   ----",groupUpdated);
                return res.status(200).send({group: groupUpdated});
            });
            ///    res.redirect('/groups')
    }

    this.deleteMemberFromGroup = (req, res) => {
        console.log("[ctrlGroups/deleteMemberFromGroup] Group: ", req.params.groupId +"------------------------------");
        console.log("[ctrlGroups/deleteMemberFromGroup] User: ", req.params.userId +"------------------------------");
        let groupId = req.params.groupId;
        let userId = req.params.userId;
        //let user = req.user
        //let userId = user['_id']

        /*if (dataUserGroup.isAdmin(req) == 0 ) {
            return res.status(401).send({message: 'No eres administrador del grupo' + err});
        }*/

        Group.update(
            { _id: groupId },
            { $pull: { 'members': {user: userId} } },
            //{ $unset: { 'members.user': {$in: userId} } },

            function(err, groupUpdated) {
                if (err) {
                  return res.status(500).send({message: 'Error en DB ' + err});
                }
                  return res.status(200).send({group: groupUpdated});
            }
        );

    }

    this.sendRequest = (req, res) => { // solicitud oara pertenecer al grupo
        let groupId = req.params.groupId
        let user = req.user
        let userId = '';
        let comment = req.params.comment

            if (user != undefined){
                console.log("[ctrlGroups/sendRequest]  ", Object.keys(req.session) + "sess ")
                console.log("[ctrlGroups/sendRequest] user Id: ", user['_id'])
                userId = user['_id']
            }
            else {
                res.redirect('/accounts/signin')
            }

        console.log("[ctrlGroups/sendRequest] -Solicitud a grupo, userId  ", groupId, userId);

        Group.count({ '_id': groupId, 'requests.sendBy': {$in: userId} },  (err, countRequestToGroup) => { // TODO posible error -> validar si existe el grupo

            console.log("[ctrlGroups/sendRequest]  countRequestToGroup:  ", countRequestToGroup);
            if (countRequestToGroup == 0) { // NO envió solicitud al grupo antes !
                Group.findOneAndUpdate(
                    //{ '_id': groupId, 'requests.sendBy': {$in: userId}}, // condiciones
                    { '_id': groupId}, // condiciones
                    { $push: {  // Datos a Actualizar
                         requests: {sendBy: userId},
                         comment: comment }
                    },
                    function(err, groupUpdated) {
                        if (err) {
                          return res.status(500).send({message: 'Error en DB groupMemberFound Update ' + err});
                        }
                        return res.status(200).send({group: groupUpdated});
                    }
                )
            } else{ // fin if existe el grupo
                return res.status(200).send({message : "Ya ha enviado una solicitua al grupo"});
            }

        })


    }

    this.getMyGroups = (req, res) => { // REtorna los grupos en los que esta el userId
        //let userId = req.params.userId
        let userId = req.user['_id']

        console.log("[ctrlGroups/getMyGroups] Grupos con userid  ##### ", userId);

        let memberConditions =  {
                                    'members.user': userId,
                                }

        Group.find(memberConditions, (err, myGroups) => {

        /*    User.populate(myGroups, adminsPopulate, (err, myGroups) => {
                if(err) {
                    console.log(`getGroupS   Error al buscar  group ${err}`)
                    res.status(200).send(err);
                }
                console.log("/////// Group Admins  ----- " + myGroups +" ------------");
                //res.render('./viewsUserPlus/groups/view', {group: myGroups})
            });*/

            let arrayGroups = [] // SOLO  Groups ID

            for (var i = 0; i < myGroups.length; i++) {
                //console.log('[controllerGroups] ADD group  ', myGroups[i]['_id'].toString());

                //Añadir cada grupo a redis
                client.sadd(['groupsOnline', myGroups[i]["_id"].toString() ], function(err,reply) {
                        if (err) {
                            console.log("[controllerGroups /getMyGroups] Hubo un error con redis ", err)
                        }
                })
            }

            /*client.sadd(['grupos3', groups2 ], function(err, reply) { // TODO Agregar grupos del usuario ada vez que entre
                        console.log("GRUPOS SETEADOS ", reply);
                        ///res.status(200).send({message: 'done set', reply})
            })*/

            res.status(200).send(myGroups);

            if(err) {
                console.log(`getMyGroups   Error al buscar  group ${err}`)
                res.redirect('/groups')
            }

        })
    }

    this.getAllGroupsIds = (req, res) => { // REtorna los ids de  todos los grupos disponibles

        let storedGroups
        let err

        Group.find({}, (err, storedGroups) => {

            console.log("found ", storedGroups);
            //Groups = storedGroups

            if(err) {
                console.log(`[CtrlGroups/getAllGroupsIds]    Error al buscar  groupS ${err}`)
            }
            return storedGroups;

        })



        /*grops.exec((error, groups ) => {
                if(error)
                    console.log(error);
                //console.log(groups);
                console.log("[CtrlGroups] -----------------------------------------------", groups)
                console.log("------------------------------------");
            }
        )*/

        /*console.log("[CtrlGroups]", Groups)
        console.log("[CtrlGroups]", Object.keys(Groups))
            console.log("_------------------------")
            */
        //return call
    }

    this.getGroupMembers = (req, res) => {
        let groupId = req.params.groupId

        Group.findById(groupId, (err, storedGroup) => {

            let membersPopulate = {
                path: "members",
                select : "-password -provider -administrator" // Campos a excluir del usuario
            }

            User.populate(storedGroup, membersPopulate, (err, storedGroup) => {
                if(err) {
                    console.log(` [controllerGroups.getGroupMembers]   Error al buscar  miembros ${err}`)
                    res.status(500).send({err: "Error al obtener los miembros del grupo"})
                }
                //res.status(200).send(storedGroup);
                console.log("[controllerGroups.getGroupMembers] " + storedGroup +" ------------");
                res.status(400).send(storedGroup)
                res.render('./viewsUserPlus/groups/view', {group: storedGroup})
            });

            if(err) {
                console.log(`[controllerGroups.getGroupMembers]   Error al buscar  miembros ${err}`)
                res.status(500).send({err: "Error al obtener los miembros del grupo"})
            }

        })

    }

    this.getGroupAdmins = (req, res) => {
        let groupId = req.params.groupId

        Group.findById(groupId, (err, storedGroup) => {
            let adminsPopulate = {
                                    path: "members", // miembros
                                    match: {isAdmin: {$in: [true] } },  // condicion  Admin como true
                                    select : "-password -provider -administrator" // Campos a excluir del usuario
                                }

            User.populate(storedGroup, adminsPopulate, (err, storedGroup) => {
                if(err) {
                    console.log(`[ctrlGroups/getGroupAdmins]  Error al buscar  group ${err}`)
                }
                //res.status(200).send(storedGroup);
                console.log("[ctrlGroups/getGroupAdmins]  Group Admins  ----- " + storedGroup +" ------------");
                res.render('./viewsUserPlus/groups/view', {group: storedGroup})
            });

            if(err) {
                console.log(`[ctrlGroups/getGroupAdmins]  Error al buscar  group ${err}`)
                res.redirect('/groups')
            }

        })

    }

    this.isMemberGroup = (req, res, next) => { // middleware saber si es miembro del grupo
            let groupId = req.params.groupId
            let user = req.user
            console.log("[ctrlGroups/isMemberGroup]_______________________________________",groupId, " ", user, "_______________________-")
            let userId = user['_id']
            console.log(user['_id']+"########################")

            Group.find({'_id': groupId, 'members.user': {$in: userId} },  (err, storedGroup) => {// FIXME
                if(err) {
                    console.log(`[isMemberGroup]   Error al buscar  group ${err}`)
                    return false
                    //res.redirect('/groups')
                }

                if (storedGroup) {
                    return next()
                    //return true
                }
            })
            console.log({status: 401, message: "No es MIEMBRO de este grupo : Ah ah ah "})
            return false
            //return res.status(401).send({message: "No es admin de este grupo :3 Ah ah ah "});
        //}
    }


    this.isAdmin = (req, res, next) => { // middleware saber si es admin del grupo
            let groupId = req.params.groupId
            let user = req.user // TODO req.user serialize
            console.log("[ctrlGroups/isAdmin] Group: ",groupId, " -User: ", user, "_______________________-")
            let userId = user['_id']
            console.log(user['_id']+"########################")

            let adminConditions = {
                '_id': groupId,
                'members.user':  userId,
                'members.isAdmin':  true,
            }

            Group.find(adminConditions,  (err, storedGroup) => {
                if(err) {
                    console.log(`[isAdmin]   Error al buscar  group ${err}`)
                    return false
                    //res.redirect('/groups')
                }

                if (storedGroup.length != 0) {
                    console.log('[ctrlGroups/isAdmin]  ADMIN GROUP --------------------------------', Object.keys(storedGroup));
                    return next()
                    //return true
                }
            })
            console.log( "[groupsCrudController.isAdmin] No es admin de este grupo :3 Ah ah ah ")
            return false
            //return res.status(401).send({message: "No es admin de este grupo :3 Ah ah ah "});
        //}
    }

    this.addAdminToGroup = (req, res) => { // Agregar admins al grupo TODO(Solo admins del grupo)
        let groupId = req.params.groupId
        //let user = req.user
        let userId = req.params.userId;
        let comment = req.params.comment

        /*if (user != undefined){
            console.log(Object.keys(req.session) + "sess ")
            console.log(user['_id'])
            userId = user['_id']
        }
        else {
            res.redirect('/accounts/signin')
        }*/

        console.log("[ctrlGroups/addAdminToGroup] -Agregado ADMIN a grupo, userId ", groupId, userId);
        /*let adminsPopulate = {
            path: "members", // miembros
            match: {isAdmin: {$in: [true] } },  // condicion  Admin como true
            select : "-password -provider -administrator" // Campos a excluir del usuario


        }*/

        //$inc incrementar un campo: {campo: nVecesUm}
        Group.findOneAndUpdate(
            { '_id': groupId,  'members.user':  userId },// condiciones
            { $set: {
                 'members.$.isAdmin': 'true' ,
              }
            },

            function(err, groupUpdated) {
                if (err) {
                  return res.status(500).send({message: 'Error en DB ' + err});
                }
                return res.status(200).send({group: groupUpdated});
            }
        );

    }

    this.deleteAdminFromGroup = (req, res) => { // Eliminar admins al grupo TODO(Solo admins del grupo puede usar) Solo el fundaddor ???
        let groupId = req.params.groupId
        //let user = req.user
        let userId = req.params.userId
        //let comment = req.params.comment

        /*if (user != undefined){
            console.log(Object.keys(req.session) + "sess ")
            console.log(user['_id'])
            userId = user['_id']
        }
        else {
            res.redirect('/accounts/signin')
        }*/

        console.log(" [ctrlGroups/deleteAdminFromGroup]----Eliminar admin del grupo, userId  ", groupId, userId);

        Group.findOneAndUpdate(
            { '_id': groupId,  'members.user':  userId },// condiciones
            { $set: {
                 'members.$.isAdmin': 'false' ,
              }
            },

            function(err, groupUpdated) {
                if (err) {
                  return res.status(500).send({message: 'Error en DB ' + err});
                }
                return res.status(200).send({group: groupUpdated});
            }
        );

    }

    // TODO Eliminar o marcar como atendida la solicitud
    this.replyRequest = (req, res) => { // REspoder solicitud para pertenecer al gru TODO(Solo admins del grupo)
        let groupId = req.params.groupId
        let user = req.user
        let userId = '';
        let comment = req.params.comment

            if (user != undefined){
                console.log(Object.keys(req.session) + "sess ")
                console.log(user['_id'])
                userId = user['_id']
            }
            else {
                res.redirect('/accounts/signin')
            }

        console.log(" [CtrlGroups/replyRequest] -Solicitud a grupo , userId ", groupId, userId);

        Group.update(
            { _id: groupId },
            { $push: {
                 requests: {sendBy: userId},
                 comment: comment }
            },

            function(err, groupUpdated) {
                if (err) {
                  return res.status(500).send({message: 'Error en DB ' + err});
                }
            return res.status(200).send({group: groupUpdated});
            }
        );

    }

    return this
}
