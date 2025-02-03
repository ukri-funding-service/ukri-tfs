import { IncomingMessage } from 'http';
import formidable, { IncomingForm } from 'formidable';

export interface FormidableParsedData {
    fields: formidable.Fields;
    files: formidable.Files;
}
export const parseMultipartFormData = async (request: IncomingMessage): Promise<FormidableParsedData> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(request, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            resolve({ fields, files });
        });
    });
};
