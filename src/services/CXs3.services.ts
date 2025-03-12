import fs from 'fs';
import dotenv from 'dotenv';

// * aws s3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// * utils
import _contantUtils from '../utils/CXconstant.utils';
import { printerError } from '../utils/CXcommon.utils';

const { 
    S3,
    SERVICE,
    PATH_SEPARATOR, 
    EMPTY_STRING: emptyValue,
    BOOLEAN_FALSE: falseValue, 
    BOOLEAN_TRUE: trueValue 
} = _contantUtils;

dotenv.config();

const { 
    BUCKET_REGION, 
    AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY, 
    BUCKET_NAME 
} = process.env;

interface File {
    path: string;
    originalname: string;
}

// * configure the AWS SDK
const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || emptyValue,
    secretAccessKey: AWS_SECRET_ACCESS_KEY || emptyValue,
  },
});

export const uploadFile = async ({ file, folder }: { file: File, folder: string }): Promise<{ status: boolean, key: string, Location: string }> => {
    try {
        const fileSize = fs.statSync(file.path).size;
        const fileStream = fs.createReadStream(file.path);
        const fileName = `${folder + PATH_SEPARATOR + new Date().valueOf()}_${file.originalname}`;

        // * upload params
        const uploadParam = {
            Bucket: BUCKET_NAME,
            Body: fileStream,
            Key: fileName,
            ContentLength: fileSize
        };

        // * upload command
        const command = new PutObjectCommand(uploadParam);
        const upload = await s3Client.send(command);

        return {
            status: upload ? trueValue : falseValue,
            Location: upload ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${fileName}` : emptyValue,
            key: upload ? fileName : emptyValue
        };
    } 
    catch (error: any) {
        printerError(error, SERVICE, S3);
        return { 
            status: falseValue, 
            key: emptyValue, 
            Location: emptyValue
        };
    }
}