import mongoose from 'mongoose';

const publicFacilitySchema = mongoose.Schema({
    name: { type: String, required: true},
    typology: { type: String, required: true},
    coordinates: { type: [Number], required: true} ,
    area: Number,
    data: {}
});

export default mongoose.model('public_facilities', publicFacilitySchema);

