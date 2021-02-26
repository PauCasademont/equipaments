import mongoose from 'mongoose';

const publicFacilitySchema = mongoose.Schema({
    name: { type: String, required: true},
    typology: { type: String, required: true},
    coordinates: { type: [Number], required: true} ,
    area: Number,
    data: {}
});

export default mongoose.model('public_facilities', publicFacilitySchema);

// const publicFacilitySchema = mongoose.Schema({
//     name: { type: String, required: true},
//     typology: { type: String, required: true},
//     coordinates: { type: [Number], required: true} ,
//     area: Number,
//     data: {
//         _id: false,
//         year: Number,
//         annual_data: [{
//             _id: false,
//             concept: String,
//             consumption: [Number],
//             price: [Number]
//         }]
//     }
// });