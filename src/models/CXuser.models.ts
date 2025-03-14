import mongoose from 'mongoose';
import _constantUtil from '../utils/CXconstant.utils';

const {
    BOOLEAN_TRUE: trueValue
} = _constantUtil;

const userSchema = new mongoose.Schema({

    google_id: {
        type: String,
        required: trueValue
    },
    name: {
        type: String,
        required: trueValue
    },
    email: {
        type: String,
        required: trueValue
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('User', userSchema);