import * as fs from "fs";
const path = require("path");
export class FileSystem{

    async ReadFile(filePath: any): Promise<Buffer> {
        return new Promise((res, rej) => {
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.log("FileSystem ERROR: ", err);
                        rej(err);
                    }
                    else {
                        res(data);
                    }
                });
            }
            else {
                rej("FileSystem File not found: " + filePath);
            }
        });
    }


    async WriteFile(file: any,fileName:string): Promise<any> {
        return new Promise((res, rej) => {
            let filePath = "";
            let dirPath = "src\\output";

            filePath = path.join(dirPath, fileName);

            fs.mkdirSync(dirPath, { recursive: true });

            fs.writeFile(filePath, file, (err) => {
                file = undefined;
                if (err) {
                    console.log("FileSystem CREATE ERROR: ", err);
                    rej(err);
                }
                res(file);
            });
        });
    }

    async DeleteFile(filePath: any): Promise<boolean> {
        return new Promise((res, rej) => {
            if (fs.existsSync(filePath)) {

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log("FileSystemSource DELETE ERROR: ", err);
                        rej(err);
                    }
                    res(true);
                });
            }
            else {
                rej("FileSystemSourceImplementation File not found: " + filePath);
            }
        });
    }
}
