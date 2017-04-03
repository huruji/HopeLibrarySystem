状态码（通过http status code查看）
200 OK 请求成功
201 created 创建成功
202 accepted 更新成功
400 bad request 请求的地址不存在或者包含不支持的参数
401 unauthorized 未授权
403 forbidden 被禁止访问
404 not found 请求的资源不存在
500 interval server error 内部错误

通用错误码
1000 需要权限 
2000 

图书api
单个信息返回
返回json{
	"id"："12323",
	"cate": "摄影类",
	"hopeid": "pr00001",
	"left": "工作室剩余量", 
	"imgsrc": "图书链接",
	"name": "一本摄影书",
	"author": "赵嘉",
	"isbn": "isbn号",
	"publisher":"机械出版社",
}

多个信息返回
返回json{
	start:0,
	count:20,
	total:5,
	books:[由单个图书json组成的数组]
}	


根据id返回图书信息
api/book/12323
返回单个图书信息

根据hopeid返回图书信息
api/book?hopeid=123123
返回单个图书信息

根据isbn返回图书信息 
api/book?isbn=12312
返回单个图书信息

根据图书类型返回图书信息，默认返回最新的前20条信息
api/book?cate=""
返回多个图书信息
如果需要返回更多的信息则可添加query参数：
start 为结果的offset
count 获取结果的个数，默认为20，最大为50

根据图书作者返回图书信息，默认返回最新的前20条记录
api/book?author=""
返回多个图书信息
同样可以有start和count两个query参数

根据图书名字返回图书信息，默认返回最新的前20条记录
api/book?name=""
返回多个图书信息
同样可以有start和count两个query参数，但是鉴于工作室的藏书量，并不建议使用这两个参数

根据出版社返回图书信息，默认返回最新的前20条记录
api/book?publisher=""
返回多个图书信息
同样可以有start和count两个query参数，但是鉴于工作室的藏书量，并不建议使用这两个参数

综上，查询图书信息支持的query参数有以下
查询条件：hopeid、isbn、cate、author、name、publisher
记录控制：start、count

查询条件可以混合使用，如
api/book?cate=''&publisher=''

但是hopeid和isbn为唯一，所以不应该和其他query参数一起使用，服务器内部会首先检查是否存在hopeid，之后在检查isbn，有这两个参数中的一个则忽略其他参数

返回目前所有的图书hopeid
api/book/hopeid
{
	{:[当前cate下的所有hopeid],
	}
}


错误码{
	404 请求的资源不存在
	400 请求参数错误
}
出错时返回信息json{
	code: 404,
	msg: "请求的资源不存在"
}