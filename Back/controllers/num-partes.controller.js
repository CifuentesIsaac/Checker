const numParteModel = require("../models/num-parte.model.js");

exports.saveNumPart = async (req, res) => {
    try {
        let numParte;
        //creacion de nuevo numero de parte
        numParte = new numParteModel(req.body);
        await numParte.save();

        res.send(numParte);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}

exports.editNumPart = async(req, res) => {
    try {
        const numPart = await numParteModel.find({_id: req.params.id});

        if(!numPart){
            res.status(404).json({
                ok: false,
                msg: 'El numero de parta no existe'
            })
        }
        numParteMod = await numParteModel.findOneAndUpdate({_id: req.params.id}, req.body);

        res.status(200).json({
            ok: true,
            msg: 'Numero de parte editado correctamente'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}

exports.getNumPart = async (req, res) =>{
    try {
        const numPartes = await numParteModel.find({Status: true});
        res.json(numPartes);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}

exports.getNumPartById = async (req, res) => {
    try {
        numPart = await numParteModel.find({_id: req.params.id});

        if(!numPart){
            res.status(404).json({
                ok: false,
                msg: 'El numero de parte no existe'
            })
        }
        res.send(numPart)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}

exports.getNumPartDisabled = async (req, res) => {
    try {
        const numPartDis = await numParteModel.find({Status: false});
        if(this.getNumPartDisabled.length <= 0) {
            res.status(404).json({
                ok: false,
                msg:'No hay numeros de parte desactivados'
            })
        }
        
        res.json(numPartDis);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}

exports.disableNumPart = async (req, res) => {
    try {     
        // const { Status } = false;  
        let numParte = await numParteModel.findById(req.params.id)                        
        // numParte.Status = Status
        if(!numParte){
            res.status(404).json({
                ok: false,
                msg: 'El numero de parte no existe'
            })
        }
        numParteMod = await numParteModel.findOneAndUpdate({_id: req.params.id}, {Status: false})

        // res.json('Estatus modificado false')
        res.status(200).json({
            ok: true,
            msg: 'Numero de parte desactivado'            
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
} 

exports.enableNumPart = async (req, res) => {
    try {
        let numParte = await numParteModel.findById(req.params.id)
        if(!numParte){
            res.status(404).json({
                ok: false,
                msg: 'El numero de parte no existe'
            });
        }

        numParteMod = await numParteModel.findOneAndUpdate({_id: req.params.id}, {Status: true})

        res.status(200).json({
            ok: true,
            msg: 'Numero de parte habilitado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            type: error.name,
            message: error.message
        })
    }
}