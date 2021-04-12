import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true},
    is_admin: { type: Boolean, required: true },
    public_facility_id: { type: String, required: true}
});

export default mongoose.model('users', userSchema);