const userModel = require('../models/userModel');
const SHA256 = require('crypto-js/sha256');
const jsonwebtoken = require('jsonwebtoken');

exports.saveUser = async (req, res) => {
    try {
        let userData = req.body;

        //Encriptado de la contraseña
        if (userData.Password){
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

exports.login = async(req, res) => {
    let contra = SHA256(req.body.Password).toString();
    let Employe_ID = req.body.Employee_ID;

    const loginUser = await userModel.findOne({Employee_ID:Employe_ID, Password:contra, Active: true});

    if(loginUser!=null){
        let token = jsonwebtoken.sign({usuarios: loginUser},process.env.MASTER_KEY, {expiresIn:'8h'});        
        res.status(200).json({
            ok:true,
            msg:'Exito',
            jwt:token,            
            user:loginUser
        });
    }else{
        res.status(401).json({
            ok:false,
            msg:'Usuario no encontrado',            
            jwt:'Vacio',
            user:''
        });
    } 
}