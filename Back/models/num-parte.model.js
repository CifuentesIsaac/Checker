const mongoose = require('mongoose');

const numParteSchema = mongoose.Schema({    
    NumIssue:{ type: Number, required: true},
    NumPart:{ type: String, required: true},
    Qty:{ type: Number, required: true},
    Description:{ type: String, required: true},
    DNFP:{ type: String, required: true},
    TestCode:{ type: String, required: true},
    Project:{ type: String, required: true},
    IndividualWeight:{ type: Number, required: true},
    customer:{ type: String},
    Status: {type: Boolean}
},
    {
        versionKey: false
    }
);

module.exports = mongoose.model('num-parte', numParteSchema);