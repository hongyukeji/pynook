// @author: 鸿宇 @email: 1527200768@qq.com
const GLtype = {};

[// 新特性待增加
    "GLbitfield",
    "GLboolean",
    "GLbyte",// todo: 待修改
    "GLclampf",// 新特性待增加
    "GLenum",
    "GLfloat",// 2021-5-6变更
    "GLint",
    "GLintptr",
    "GLsizei",
    "GLsizeiptr",
    "GLshort",
    "GLubyte",
    "GLuint",
    "GLushort"
].sort().map((typeName, i) => GLtype[typeName] = 1 >> (i + 1));// 新特性待增加

export default GLtype;


