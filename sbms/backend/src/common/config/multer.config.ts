import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadedFileInfo } from '../interfaces/uploaded-file.interface';

const ALLOWED_EXTENSIONS = /\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|zip|txt|csv)$/i;

function buildUploadOptions(subfolder: string) {
  return {
    storage: diskStorage({
      destination: `./uploads/${subfolder}`,
      filename: (
        _req: unknown,
        file: UploadedFileInfo,
        callback: (error: Error | null, filename: string) => void,
      ) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (
      _req: unknown,
      file: UploadedFileInfo,
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      if (!ALLOWED_EXTENSIONS.test(file.originalname)) {
        callback(
          new BadRequestException(
            'Unsupported file type. Allowed: pdf, doc(x), xls(x), ppt(x), png, jpg, zip, txt, csv',
          ),
          false,
        );
        return;
      }
      callback(null, true);
    },
  };
}

export const taskFileUploadOptions = buildUploadOptions('tasks');

export const completedFileUploadOptions = buildUploadOptions('completed');
