import { Request, Response } from 'express';

// * services
import { 
    allMediaService,
    uploadMediaService
} from '../services/CXmedia.services'; 

// * utils
import { handlerError } from '../utils/CXcommon.utils';
import _constantUtil from '../utils/CXconstant.utils';

const { MEDIA, CONTROLLER } = _constantUtil;

// * high order function for service handler
const serviceHandler = (func: (req: Request, res: Response) => Promise<Response>) => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            await func(req, res);
        } catch (error: any) {
            handlerError(res, req.originalUrl, error, CONTROLLER, MEDIA, {});
        }
    };
};

// * export media controllers
export const allMedia = serviceHandler(allMediaService);
export const uploadMedia = serviceHandler(uploadMediaService);