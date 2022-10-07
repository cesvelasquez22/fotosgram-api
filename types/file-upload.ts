export interface FileUpload {
    name: string;
    data: Buffer;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
    mv: (path: string, callback: (err: any) => void) => Promise<void>;
}