import { Request, Response } from 'express';

// * services
import { 
    googleLoginService,
    verifyTokenService
} from '../services/CXauthentication.services'; 

// * utils
import { handlerError } from '../utils/CXcommon.utils';
import _constantUtil from '../utils/CXconstant.utils';

const { AUTHENTICATION, CONTROLLER } = _constantUtil;

// * high order function for service handler
const serviceHandler = (func: (req: Request, res: Response) => Promise<Response>) => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            await func(req, res);
        } catch (error: any) {
            handlerError(res, req.originalUrl, error, CONTROLLER, AUTHENTICATION, {});
        }
    };
};

// * export authentication controllers
export const googleLogin = serviceHandler(googleLoginService);
export const verifyToken = serviceHandler(verifyTokenService);