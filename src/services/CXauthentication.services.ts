import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

// * models & services
import User from '../models/CXuser.models';

// * utils
import { viewJSONResponse, handlerError, printerError } from '../utils/CXcommon.utils';
import _constantUtil from '../utils/CXconstant.utils';

const {
    SERVICE,
    STATUS_200,
    STATUS_403,
    ACCESS_DENIED,
    UNAUTHORIZED_USER,
    AUTHORIZATION,
    AUTHENTICATION,
    DATA_FETCHED,
    BOOLEAN_TRUE: trueValue,
    BOOLEAN_FALSE: falseValue,
    EMPTY_STRING: emptyValue
} = _constantUtil;

const verifyJwtToken = (token: string): JwtPayload | boolean => {
    try {
        const verifyTokenKey = process.env.WEB_VERIFY_TOKEN_KEY || '';
        return jwt.verify(token, verifyTokenKey) as JwtPayload;
    } 
    catch (error: any) {
        return falseValue;
    }
};

const verifyGoogleToken = async (token: any) => {
    try {
        const url: string = `${process.env.GOOGLE_API}/v3/tokeninfo?id_token=${token}`;

        const response = await axios.get(url);
        const userData = response.data;
      
        if (!userData.email_verified) {
            return {
                status: falseValue,
                message: 'Email not verified with Google',
                data: {}
            }
        }
      
        return {
            status: trueValue,
            message: '',
            data: {
                googleId: userData.sub,
                email: userData.email,
                name: userData.name
            }
        };
    } 
    catch (error: any) {
      printerError(error, SERVICE, AUTHENTICATION);

        return {
            status: falseValue,
            message: 'Invalid Google token',
            data: {}
        }
    }
};

export const googleLoginService = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        const userData = await verifyGoogleToken(token);

        if (!userData.status) {
            return viewJSONResponse(res, falseValue, STATUS_200, userData.message, {});
        }

        const user = {
            id: userData.data.googleId,
            email: userData.data.email,
            name: userData.data.name
        };

        const verifyTokenKey = process.env.WEB_VERIFY_TOKEN_KEY || emptyValue;
        const jwtToken = jwt.sign(user, verifyTokenKey, { expiresIn: '2h' });

        const upsertUser = await User.updateOne({ google_id: userData.data.googleId }, {
            $set: {
                name: userData.data.name,
                email: userData.data.email
            }
        }, { upsert: trueValue });

        // * api response
        if (upsertUser.acknowledged) {
            return viewJSONResponse(res, trueValue, STATUS_200, DATA_FETCHED, {
                token: jwtToken,
                user
            }); 
        }

        return viewJSONResponse(res, falseValue, STATUS_200, 'Try after some time.', {}); 
    } 
    catch (error: any) {
        return handlerError(res, req.originalUrl, error, SERVICE, AUTHENTICATION, {});
    }
}

export const verifyTokenService = async (req: Request, res: Response) => {
    try {
        const token = req.header(AUTHORIZATION);

        // * validate token
        if (!token) {
            return viewJSONResponse(res, falseValue, STATUS_403, ACCESS_DENIED, {});
        }

        // * verify the token
        const decoded = verifyJwtToken(token);
        if (!decoded) {
            return viewJSONResponse(res, falseValue, STATUS_403, UNAUTHORIZED_USER, {});
        }
        
        // * api response
        return viewJSONResponse(res, trueValue, STATUS_200, DATA_FETCHED, {
            valid: trueValue,
            user: decoded
        });    
    } 
    catch (error: any) {
        return handlerError(res, req.originalUrl, error, SERVICE, AUTHENTICATION, {});
    }
}