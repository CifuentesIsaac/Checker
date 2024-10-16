const userModel = require('../models/userModel');
const SHA256 = require('crypto-js/sha256');
const jsonwebtoken = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const randomPassword = require('secure-random-password')

exports.saveUser = async (req, res) => {
    try {
        let userData = req.body;

        //Encriptado de la contraseña
        if (userData.Password) {
            const hashedPass = SHA256(userData.Password).toString();
            userData.Password = hashedPass;
        }

        //Creacion de usuario
        let user = new userModel(userData);
        await user.save();

        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            type: error.name,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    let contra = SHA256(req.body.Password).toString();
    let Employe_ID = req.body.Employee_ID;

    const loginUser = await userModel.findOne({ Employee_ID: Employe_ID, Password: contra, Active: true });

    if (loginUser != null) {
        let token = jsonwebtoken.sign({ usuarios: loginUser }, process.env.MASTER_KEY, { expiresIn: '8h' });
        res.status(200).json({
            ok: true,
            msg: 'Exito',
            jwt: token,
            user: loginUser
        });
    } else {
        res.status(401).json({
            ok: false,
            msg: 'Usuario no encontrado',
            jwt: 'Vacio',
            user: ''
        });
    }
}

function asignarContra() {
    const passGenerated = randomPassword.randomPassword({
        characters: [
            randomPassword.digits,
            randomPassword.upper,
        ],
        length: 6
    });

    return passGenerated;
}

exports.forgotPassword = async (req, res) => {
    const tempPass = asignarContra();
    const codNewPass = SHA256(tempPass).toString();

    const userToUpdate = await userModel.find({ Employee_ID: req.body.Employee_ID, Active: true });
    if (userToUpdate && userToUpdate.length > 0) {
        let transport = nodemailer.createTransport({
            host: "smtp.ionos.mx",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_HOST,
                pass: process.env.PASS_MAIL
            }
        });

        let mailOptions = {
            from: "'System Support' systems.support@wmsvantec.com.mx",
            to: `${userToUpdate[0].Mail}`,
            subject: `Solicitud de cambio de contraseña para usuario con No. Nomina ${userToUpdate[0].Employee_ID}`,
            text: `Utilice la siguiente contraseña para acceder al sistema. Al introducirla el sistema le solicita cambiarla por una de su elección.
            Contraseña: ${tempPass}`
        }

        await userModel.updateOne({ Employee_ID: req.body.Employee_ID }, { $set: { Password: codNewPass, ItsNew: true } });

        transport.sendMail(mailOptions, function (error) {
            if (error) {
                console.log(error);
                return res.status(404).json({
                    ok: false,
                    msg: 'Error al enviar correo: ' + error.message
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Correo enviado'
            });
        })
    } else {
        return res.status(404).json({
            ok: false,
            msg: 'Error: ' + error.message
        })
    }
}

exports.changePass = async (req, res) => {
    const newPass = SHA256(req.body.password).toString();
    const user = await userModel.updateOne({ Employee_ID: req.body.NNomina }, { $set: { Password: newPass, ItsNew: false } });

    if (user.modifiedCount == 1) {
        res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada',
        });
    } else {
        res.status(404).json({
            ok: false,
            msg: 'Error'
        });
    }
}