## upload-to-qiniu

上传文件到七牛云对象存储，可递归上传所有目录，忽略指定前缀。

## 参数

| 参数 | 必须 | 说明               | 默认 | 例子          |
| ---- | ---- | ------------------ | ---- | ------------- |
| -a   | 是   | access key         |      | "access key"  |
| -s   | 是   | secret key         |      | "secret key"  |
| -d   | 否   | 要上传的目录       | "./" | "images"      |
| -b   | 是   | 空间名称           |      | "test-bucket" |
| -e   | 否   | 匹配前缀不会被上传 |      | "images" "js" |

完整示例：

```shell
upload-to-qiniu -a "access key" -s "secret key" -b test-bucket -e images tags
```

讲当前目录所有文件上传到 test-bucket 空间，并忽略 images 和 tags 前缀。

前缀（上传文件名）的起始是执行命令的目录，例如指定上传目录为 public 那么所有文件命名都以 public 开头，忽略前缀应该为 public/images 和 public/tags。
