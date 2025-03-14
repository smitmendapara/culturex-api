import mongoose from 'mongoose';
import _constantUtil from '../utils/CXconstant.utils';

const {
    BOOLEAN_TRUE: trueValue
} = _constantUtil;

const mediaSchema = new mongoose.Schema({

    google_id: {
        type: String,
        required: trueValue
    },
    file: {
        type: String,
        required: trueValue
    },
    file_type: {
        type: String,
        required: trueValue
    },
    size: {
        type: Number,
        required: trueValue
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('Media', mediaSchema);