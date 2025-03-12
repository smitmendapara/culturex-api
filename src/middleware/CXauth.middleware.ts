import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { viewJSONResponse, handlerError } from '../utils/CXcommon.utils';
import _constantUtil from '../utils/CXconstant.utils';

const { 
    AUTHORIZATION, 
    BOOLEAN_FALSE: falseValue, 
    AUTH, 
    STATUS_403, 
    ACCESS_DENIED,
    UNAUTHORIZED_USER, 
    MIDDLEWARE,
    THREE,
    PATH_SEPARATOR,
    EMPTY_STRING: emptyValue
} = _constantUtil;

// * authentication
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const token = req.header(AUTHORIZATION);

        // * validate token
        if (!token) {
            return viewJSONResponse(res, falseValue, STATUS_403, ACCESS_DENIED, {});
        }

        // * get verify token key
        const verifyTokenKey = process.env.WEB_VERIFY_TOKEN_KEY || emptyValue;

        // * decode token and verify admin
        jwt.verify(token, verifyTokenKey, (error, decode: any) => {
            const hasPermission = decode?.permission && decode.permission.includes(PATH_SEPARATOR + req.baseUrl.split(PATH_SEPARATOR)[THREE]);

            // * validate permission
            if (error || !hasPermission) {
                return viewJSONResponse(res, falseValue, STATUS_403, UNAUTHORIZED_USER, {});
            }

            // * assign user details
            req.user = decode;

            // * next middleware
            next();
        });
    }
    catch (error: any) {
        return handlerError(res, req.originalUrl, error, MIDDLEWARE, AUTH, {});
    }
}