# 物记 Supabase Auth 配置

## 1. Auth Provider

在 Supabase Dashboard 中打开：`Authentication → Providers → Email`。

- 开启 Email provider
- 生产环境建议开启 Confirm email
- 设置密码最小长度为 6 位或更高

## 2. URL Configuration

在 `Authentication → URL Configuration` 中配置：

- Site URL：部署后的正式地址
- Local redirect URL：`http://localhost:8000/index.html`
- Vercel redirect URL：`https://wuji-xi.vercel.app/index.html`

如果使用其他域名，也要把实际的 `index.html` 地址加入 Redirect URLs。

## 3. 数据库

按顺序执行：

1. `supabase-auth.sql`
2. `supabase-product-model.sql`
3. `supabase-shopping-cart.sql`

执行后，检查 SQL 最后两个查询：所有业务表的 `rowsecurity` 应为 `true`，并且每张表都应存在只允许 `auth.uid()` 访问自己数据的策略。

## 4. 邮件模板

在 `Authentication → Email Templates` 中修改：

- Confirm signup
- Reset password

邮件内容建议使用「物记」语气，例如：

```text
完成验证后，你的物品记录就可以跨设备同步了。
```

## 5. 本地测试

启动项目：

```text
python server.py
```

打开：`http://localhost:8000`。

测试顺序：

1. 注册一个新邮箱
2. 完成邮箱验证
3. 返回应用登录
4. 选择“上传并合并”本机记录
5. 退出登录
6. 使用同一账号重新登录
7. 检查物品、店铺和想买记录是否仍然存在
8. 使用另一个账号确认看不到前一个账号的数据
