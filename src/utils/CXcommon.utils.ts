import dotenv from 'dotenv';
import { Response } from 'express';

// * utils
import _constantUtil from './CXconstant.utils';
import _loggerUtil from './CXlogger.utils';

dotenv.config();

const {
    STATUS_400,
    BAD_REQUEST,
    HIGH_PRIORITY_LOG,
    BOOLEAN_FALSE: falseValue
} = _constantUtil;

// * printer error
export const printerError = (error: Error, from: string, at: string): void => {
    _loggerUtil.error(`${error}`, {
        [from]: at,
        priority: HIGH_PRIORITY_LOG
    });
}

// * view JSON response
export const viewJSONResponse = (res: Response, status: boolean, code: number, message: string, data: any): Response => {
    return res.json({
        status,
        code,
        message,
        data
    });
}

// * handle error
export const handlerError = (res: Response, originalUrl: string, error: Error, from: string, at: string, data: any): Response => {
    _loggerUtil.error(`${error}`, {
        api: originalUrl,
        [from]: at,
        priority: HIGH_PRIORITY_LOG
    });

    return viewJSONResponse(res, falseValue, STATUS_400, BAD_REQUEST, data);
}