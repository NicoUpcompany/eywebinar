require('dotenv').config();
const nodemailer = require("nodemailer");
const request = require("request");
const moment = require("moment");
require('moment/locale/es');
const XLSX = require('xlsx');
const path = require('path');
const mongoose = require('mongoose');

const Agenda = require("../models/agenda");
const User = require("../models/user");

const upEmail = process.env.EMAIL;
const upPassword = process.env.PASSWORD_EMAIL;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: upEmail,
        pass: upPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

function scheduling (req, res) {

    const { id } = req.params;
    const { user, description } = req.body;

    Agenda.findById({_id: id}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                if (agendaStored.user !== null) {
                    res.status(403).send({ ok: false, message: "Este horario ya ha sido agendado"});
                } else {
                    agendaStored.user = user;
                    agendaStored.description = description;
                    Agenda.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                        if (err) {
                            res.status(500).send({ ok: false, message: "Error del servidor"});
                        } else {
                            if (!agendaUpdate) {
                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                            } else {
                                User.findById({_id: user}, (err, userStored) => {
                                    if (err) {
                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                    } else {
                                        if (!userStored) {
                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                        } else {
                                            const data = {
                                                properties: {
                                                    lang: 'es',
                                                    enable_chat: true,
                                                    enable_screenshare: true
                                                }
                                            }
                                            const options = {
                                                method: 'POST',
                                                "rejectUnauthorized": false,
                                                url: 'https://api.daily.co/v1/rooms',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: 'Bearer 89f4f3900e44f726a1d5afc01609bda3aabbc8028942e9f29dd8f22bdbd06fe3'
                                                },
                                                body: data,
                                                json: true
                                            };
                                    
                                            request(options, function (error, response, body) {
                                                if (error) {
                                                    res.status(500).send({ ok: false, message: error })
                                                } else {
                                                    agendaStored.link = body.url;
                                                    Agenda.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                                                        if (err) {
                                                            res.status(500).send({ ok: false, message: "Error del servidor"});
                                                        } else {
                                                            if (!agendaUpdate) {
                                                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                                            } else {
                                                                User.findById({_id: agendaStored.owner}, (err, ownerStored) => {
                                                                    if (err) {
                                                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                    } else {
                                                                        if (!ownerStored) {
                                                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                                                        } else {
                                                                            const mailOptions = {
                                                                                from: `Health Tech Latam <${upEmail}>`,
                                                                                to: `${userStored.email}`,
                                                                                subject: 'Reunión agendada',
                                                                                text: `Reunión a las ${agendaStored.hour} del día ${agendaStored.day} agendada (link: ${body.url})`,
                                                                                html: `
                                                                                <html>
                                                                                    <head>
                                                                                        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap" rel="stylesheet">
                                                                                        <title>healthtech</title>
                                                                                    </head>
                                                                                    <body style="background:#f6f6f6;">
                                                                                        <div style="background:#fff;color:#fff; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Barlow, sans-serif;">
                                                                                        
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:10px;margin-bottom:0;">
                                                                                                <tr>
                                                                                                    <th align="center" width="100%"> 
                                                                                                        <img src="https://upwebinar.cl/mailing/healthtech/img1.jpg" width="100%"/>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:20px;margin-bottom:0;">
                                                                                                <tr>
                                                                                                    <th align="center"> 
                                                                                                        <img src="https://upwebinar.cl/mailing/cognitiva/check.png"/>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                <tr>
                                                                                                    <td align="center" width="100%" style="color:#1c1c1c;padding: 20px 0;text-transform: uppercase;"> 
                                                                                                        <h3 style="color: #1c1c1c; font-size: 28px;margin-bottom: 20px;font-weight: 700;">Reunión Confirmada</h3>
                                                                                                        <p style="margin: 0;padding: 0;font-size: 18px;color:#1c1c1c;text-align:center;font-weight: 500;">
                                                                                                            <strong>DIA ${agendaStored.day} MARZO 2021 - A LAS ${agendaStored.hour} HRS</strong>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                <tr>
                                                                                                    <td align="center" width="100%" style="color:#1c1c1c;padding: 20px 0 50px;"> 
                                                                                                        <h3 style="color: #1c1c1c; font-size: 28px;margin-bottom: 20px;font-weight: 700;">Descripción</h3>
                                                                                                        <p style="margin: 0;padding: 0 20px;font-size: 18px;color:#1c1c1c;text-align:center;">
                                                                                                            ${agendaStored.description}
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                <tr>
                                                                                                    <td align="center" width="100%" style="color:#1c1c1c;padding: 0 50px;">
                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                            <tr>
                                                                                                                <td align="left" width="100%" style="color:#9244e4;padding: 30px;border: 1px solid #e6e9ee;font-size: 14px;background: #e3e3e3;"> 
                                                                                                                    <p>
                                                                                                                        Link de ingreso:
                                                                                                                    </p>
                                                                                                                    <p style="border: 1px solid #e6e9ee;padding: 10px 20px;text-align: left;border-radius: 3px;background: #fff;">
                                                                                                                        <a href="${body.url}" style="text-decoration: none;color: #1c1c1c;">${body.url}</a>
                                                                                                                    </p>

                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 0; padding: 50px 0;background: #2f333f;position: relative;">
                                                                                                <tr>
                                                                                                    <td align="left" width="100%" style="padding: 0 0 0 50px;">
                                                                                                        <p style="color: #fff; font-size: 14px;margin-bottom: 30px;">
                                                                                                            <strong>Chiletec 2021</strong><br/><br/>
                                                                                                            ¡No te lo pierdas! Recuerda que si tienes alguna duda o <br/>
                                                                                                            sugerencia nos puedes escribir a healthtech@chiletec.org
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>
                                                                                    </body>
                                                                                </html>
                                                                                `
                                                                            };
                                                                            transporter.sendMail(mailOptions, function(error, info){
                                                                                if(error){
                                                                                    res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                                } else {
                                                                                    const mailOptions2 = {
                                                                                        from: `Health Tech Latam <${upEmail}>`,
                                                                                        to: `${ownerStored.email}`,
                                                                                        subject: 'Te han agendado una reunión',
                                                                                        text: `Reunión a las ${agendaStored.hour} del día ${agendaStored.day} agendada (link: ${body.url})`,
                                                                                        html: `
                                                                                        <html>
                                                                                            <head>
                                                                                                <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap" rel="stylesheet">
                                                                                                <title>healthtech</title>
                                                                                            </head>
                                                                                            <body style="background:#f6f6f6;font-family: 'Source Sans Pro', sans-serif;">
                                                                                                <div style="background:#fff;color:#fff; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Barlow, sans-serif;">
                                                                                                
                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:10px;margin-bottom:0;">
                                                                                                        <tr>
                                                                                                            <th align="center" width="100%"> 
                                                                                                                <img src="https://upwebinar.cl/mailing/healthtech/img1.jpg" width="100%"/>
                                                                                                            </th>
                                                                                                        </tr>
                                                                                                    </table>

                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:20px;margin-bottom:0;">
                                                                                                        <tr>
                                                                                                            <th align="center"> 
                                                                                                                <img src="https://upwebinar.cl/mailing/cognitiva/check.png"/>
                                                                                                            </th>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                        <tr>
                                                                                                            <td align="center" width="100%" style="color:#1c1c1c;padding: 20px 0;text-transform: uppercase;"> 
                                                                                                                <h3 style="color: #1c1c1c; font-size: 28px;margin-bottom: 20px;font-weight: 700;">Te han agendado una reunión</h3>
                                                                                                                <p style="margin: 0;padding: 0;font-size: 18px;color:#1c1c1c;text-align:center;font-weight: 500;text-transform: none;">
                                                                                                                    <strong>Revisa tu perfil en la plataforma</strong>
                                                                                                                </p>
                                                                                                                <p style="margin: 0;padding: 0;font-size: 18px;color:#1c1c1c;text-align:center;font-weight: 500;">
                                                                                                                    <strong>DIA ${agendaStored.day} MARZO 2021 - A LAS ${agendaStored.hour} HRS</strong>
                                                                                                                </p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                        <tr>
                                                                                                            <td align="center" width="100%" style="color:#1c1c1c;padding: 20px 0 50px;"> 
                                                                                                                <h3 style="color: #1c1c1c; font-size: 28px;margin-bottom: 20px;font-weight: 700;">Descripción</h3>
                                                                                                                <p style="margin: 0;padding: 0 20px;font-size: 18px;color:#1c1c1c;text-align:center;">
                                                                                                                    ${agendaStored.description}
                                                                                                                </p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>

                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                        <tr>
                                                                                                            <td align="center" width="100%" style="color:#1c1c1c;padding: 0 50px;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                                                                    <tr>
                                                                                                                        <td align="left" width="100%" style="color:#9244e4;padding: 30px;border: 1px solid #e6e9ee;font-size: 14px;background: #e3e3e3;"> 
                                                                                                                            <p>
                                                                                                                                Link de ingreso:
                                                                                                                            </p>
                                                                                                                            <p style="border: 1px solid #e6e9ee;padding: 10px 20px;text-align: left;border-radius: 3px;background: #fff;">
                                                                                                                                <a href="${body.url}" style="text-decoration: none;color: #1c1c1c;">${body.url}</a>
                                                                                                                            </p>

                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>


                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 0; padding: 50px 0;background: #2f333f;position: relative;">
                                                                                                        <tr>
                                                                                                            <td align="left" width="100%" style="padding: 0 0 0 50px;">
                                                                                                                <p style="color: #fff; font-size: 14px;margin-bottom: 30px;">
                                                                                                                    <strong>Chiletec 2021</strong><br/><br/>
                                                                                                                    ¡No te lo pierdas! Recuerda que si tienes alguna duda o <br/>
                                                                                                                    sugerencia nos puedes escribir a healthtech@chiletec.org
                                                                                                                </p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>


                                                                                                </div>
                                                                                            </body>
                                                                                        </html>
                                                                                        `
                                                                                    };
                                                                                    transporter.sendMail(mailOptions2, function(error, info){
                                                                                        if(error){
                                                                                            res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                                        } else {
                                                                                            res.status(200).send({
                                                                                                ok: true,
                                                                                                link: body.url,
                                                                                                message: "Reunión agendada correctamente, te hemos enviado un correo con la confirmación y el link de reunión"
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

function getAgendaAvailableByDay(req, res) {
    const { userId, day } = req.body;

    Agenda.find({$and: [ { active: {$ne: false} }, { owner: mongoose.Types.ObjectId(userId) }, { day: day.toString() }, { user: null } ]}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                const agendaArray = [];
                agendaStored.forEach(element => {
                    const now = new Date(moment().subtract(3, 'hours').format()).getTime();
                    const eventTime =  new Date(moment().format(element.time)).getTime();
                    if (eventTime > now) {
                        agendaArray.push(element);
                    }
                });
                res.status(200).send({ ok: true, agenda: agendaArray });
            }
        }
    });
}

function getAgendaByOwner(req, res) {
    const { userId, day } = req.body;

    Agenda.find({$and: [ { owner: mongoose.Types.ObjectId(userId) }, { day: day.toString() }]}).populate('user', 'name lastname email phone enterprise position sector').exec((err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                res.status(200).send({ ok: true, agenda: agendaStored });
            }
        }
    });
}

function getAgendaAll(req, res) {

    Agenda.find({}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                res.status(200).send({ ok: true, agenda: agendaStored });
            }
        }
    });
}

function xlsxToJson(req, res) {
    const pathXLSX = path.resolve(__dirname, '../uploads/Agendas.xlsx');
    const workbook = XLSX.readFile(pathXLSX);
    const sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(async function(y) {
        const worksheet = workbook.Sheets[y];
        const headers = {};
        const data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            const col = z.substring(0,tt);
            const row = parseInt(z.substring(tt));
            const value = worksheet[z].v;
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        data.shift();
        data.shift();
        
        for (let i = 0; i < data.length; i++) {

            const agenda = new Agenda();
            agenda.hour = data[i].Hour;
            agenda.day = data[i].Day;
            agenda.owner = data[i].owner;
            agenda.time = data[i].time;

            await agenda.save((err, agendaStored) => {
                console.log(i);
            });
            
        }
        
    });
    res.status(200).send({message: `Import xlsx exitoso`});
}

function changeAgendaStatus(req, res) {
    const { id } = req.params;

    let userId = null;

    Agenda.findById({_id: id}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                if (agendaStored.user === null) {
                    if (agendaStored.active) {
                        agendaStored.active = false;
                        Agenda.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor"});
                            } else {
                                if (!agendaUpdate) {
                                    res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                } else {
                                    res.status(200).send({
                                        ok: true,
                                        message: `El horario ${agendaStored.hour} del día ${agendaStored.day} se ha marcado como no disponible`
                                    });
                                }
                            }
                        });
                    } else {
                        agendaStored.active = true;
                        Agenda.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor"});
                            } else {
                                if (!agendaUpdate) {
                                    res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                } else {
                                    res.status(200).send({
                                        ok: true,
                                        message: `El horario ${agendaStored.hour} del día ${agendaStored.day} se ha marcado como disponible`
                                    });
                                }
                            }
                        });
                    }
                } else {
                    userId = agendaStored.user;
                    agendaStored.user = null;
                    agendaStored.link = "";
                    agendaStored.description = "";
                    Agenda.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                        if (err) {
                            res.status(500).send({ ok: false, message: "Error del servidor"});
                        } else {
                            if (!agendaUpdate) {
                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                            } else {
                                User.findById({_id: userId}, (err, userStored) => {
                                    if (err) {
                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                    } else {
                                        if (!userStored) {
                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                        } else {
                                            User.findById({_id: agendaStored.owner}, (err, ownerStored) => {
                                                if (err) {
                                                    res.status(500).send({ ok: false, message: "Error del servidor"});
                                                } else {
                                                    if (!ownerStored) {
                                                        res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                                    } else {
                                                        const mailOptions = {
                                                            from: `Health Tech Latam <${upEmail}>`,
                                                            to: `${userStored.email}, ${ownerStored.email}`,
                                                            subject: 'Reunión cancelada',
                                                            text: `La reunión a las ${agendaStored.hour} del día ${agendaStored.day} fue cancelada`,
                                                            html: `
                                                            <html>
                                                                <head>
                                                                    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap" rel="stylesheet">
                                                                    <title>Health Tech Latam</title>
                                                                </head>
                                                                <body style="background:#f6f6f6;">
                                                                    <div style="background:#fff;color:#fff; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Barlow, sans-serif;">
                                                                    
                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:10px;margin-bottom:0;">
                                                                            <tr>
                                                                                <th align="center" width="100%"> 
                                                                                    <img src="https://upwebinar.cl/mailing/healthtech/img1.jpg" width="100%"/>
                                                                                </th>
                                                                            </tr>
                                                                        </table>
                                                            
                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:20px;margin-bottom:0;">
                                                                            <tr>
                                                                                <th align="center"> 
                                                                                    <img src="https://upwebinar.cl/mailing/cognitiva/error.png"/>
                                                                                </th>
                                                                            </tr>
                                                                        </table>
                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;background: #fff;">
                                                                            <tr>
                                                                                <td align="center" width="100%" style="color:#1c1c1c;padding: 20px 0 50px;text-transform: uppercase;"> 
                                                                                    <h3 style="color: #1c1c1c; font-size: 28px;margin-bottom: 20px;font-weight: 700;">Reunión Rechazada</h3>
                                                                                    <p style="margin: 0;padding: 10px 0;font-size: 18px;color:#1c1c1c;text-align:center;font-weight: 500;">
                                                                                        <strong>DIA ${agendaStored.day} MARZO 2021 - A LAS ${agendaStored.hour} HRS</strong>
                                                                                    </p>
                                                                                    <p style="margin: 0;padding: 0;font-size: 18px;color:#1c1c1c;text-align:center;font-weight: 500;">
                                                                                        <strong>Vuelve agendar una reunión en la plataforma</strong>
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                            
                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 0; padding: 50px 0;background: #2f333f;position: relative;">
                                                                            <tr>
                                                                                <td align="left" width="100%" style="padding: 0 0 0 50px;">
                                                                                    <p style="color: #fff; font-size: 14px;margin-bottom: 30px;">
                                                                                        <strong>Chiletec 2021</strong><br/><br/>
                                                                                        ¡No te lo pierdas! Recuerda que si tienes alguna duda o <br/>
                                                                                        sugerencia nos puedes escribir a healthtech@chiletec.org
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                            
                                                                    </div>
                                                                </body>
                                                            </html>
                                                            `
                                                        };
                                                        transporter.sendMail(mailOptions, function(error, info){
                                                            if(error){
                                                                res.status(500).send({ ok: false, message: "Error del servidor"});
                                                            } else {
                                                                res.status(200).send({
                                                                    ok: true,
                                                                    message: "Reunión cancelada correctamente"
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

module.exports = {
    scheduling,
    getAgendaAvailableByDay,
    getAgendaByOwner,
    getAgendaAll,
    xlsxToJson,
    changeAgendaStatus
};
