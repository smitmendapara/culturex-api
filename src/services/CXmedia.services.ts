import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

// * models & services
import Media from '../models/CXmedia.models';
import { uploadFile } from './CXs3.services';

// * utils
import { viewJSONResponse, handlerError, printerError } from '../utils/CXcommon.utils';
import _constantUtil from '../utils/CXconstant.utils';

const {
    SERVICE,
    STATUS_200,
    MEDIA,
    DATA_FETCHED,
    EXCLUDE_FIELD: excludeField,
    BOOLEAN_TRUE: trueValue,
    BOOLEAN_FALSE: falseValue
} = _constantUtil;

export const allMediaService = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;

        // * all media of user
        const allMedia = await Media.find({ google_id: id }, {
            __v: excludeField
        })

        // * api response
        return viewJSONResponse(res, trueValue, STATUS_200, DATA_FETCHED, { record: allMedia }); 
    } 
    catch (error: any) {
        return handlerError(res, req.originalUrl, error, SERVICE, MEDIA, {});
    }
}

export const uploadMediaService = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const attachment = req.file;

        console.log('call api...')

        // * validate attachment
        if (!attachment) {
            return viewJSONResponse(res, falseValue, STATUS_200, 'No file uploaded', {}); 
        }

        // * upload media
        const uploadedMedia = await uploadFile({
            file: attachment, 
            folder: 'media'
        });

        // * validate upload
        if (!uploadedMedia.status) {
            return viewJSONResponse(res, falseValue, STATUS_200, 'Please try after some times.', {});
        }

        // * create media
        const mediaCreated = await Media.create({
            google_id: id,
            file: uploadedMedia.key,
            file_type: attachment.mimetype,
            size: attachment.size
        });

        // * file path
        const filePath = path.join(__dirname, '../../uploads/', attachment.filename);

        // * unlink file
        fs.unlink(filePath, (error) => {
            if (error) {
                printerError(error, SERVICE, MEDIA);
            }
        });

        // * api response
        if (mediaCreated)
            return viewJSONResponse(res, trueValue, STATUS_200, 'Media has been added.', {});
        return viewJSONResponse(res, falseValue, STATUS_200, 'Media has not been added.', {});
    } 
    catch (error: any) {
        return handlerError(res, req.originalUrl, error, SERVICE, MEDIA, {});
    }
}