
let mongoose = require('mongoose');

let campSchema = new mongoose.Schema({
    name: String,   
    cost: String, 
    description: String,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
},
{
	timestamps: true,
});

module.exports = mongoose.model("Camp", campSchema);