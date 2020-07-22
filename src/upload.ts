#!/usr/bin/env node
import * as qiniu from 'qiniu';
import { listFile } from './utils';
import { program } from 'commander';
import * as fs from 'fs';

program
  .version('1.0.3')
  .requiredOption('-a, --access-key [ak]', 'access key')
  .requiredOption('-s, --secret-key [sk]', 'secret key')
  .option('-d, --upload-dir <dir>', '要上传的目录', './')
  .requiredOption('-b, --bucket [bucket]', '对象存储空间名')
  .option('-e, --exclude-prefix <prefixs...>', '忽略的文件名前缀，可以设置多个')
  .parse();

const mac = new qiniu.auth.digest.Mac(program.accessKey, program.secretKey);
const config = new qiniu.conf.Config({
  useHttpsDomain: true,
});
const formUploader = new qiniu.form_up.FormUploader(config);

// 列举所有文件
listFile(program.uploadDir).then((files) =>
  files.forEach((fileName) => {
    for (const prefix of program.excludePrefix) {
      if (fileName.startsWith(prefix)) {
        return;
      }
    }
    // 可能需要覆盖已有文件，根据文件名生成 uploadToken
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${program.bucket}:${fileName}`,
      detectMime: 1,
    });
    const uploadToken = putPolicy.uploadToken(mac);
    fs.promises.readFile(fileName).then(async (fileBuffer) => {
      const putExtra = new qiniu.form_up.PutExtra(fileName);
      formUploader.put(uploadToken, fileName, fileBuffer, putExtra, (err, body, info) => {
        if (err) {
          console.log(err);
        } else if (info.status !== 200) {
          if (info.status === 614) {
            console.log(`文件已存在 ${fileName}`);
          } else {
            console.log(info);
          }
        } else {
          console.log(`成功上传 ${fileName}`);
        }
      });
    });
  }),
);
