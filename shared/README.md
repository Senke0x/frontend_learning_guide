# Shared - 共享代码

客户端和服务器之间共享的类型定义和常量。

## 目录结构

```
shared/
└── const.ts    # 共享常量
```

## 使用方式

通过路径别名 `@shared/*` 在客户端和服务器中导入：

```typescript
import { COOKIE_NAME, TIME_CONSTANTS } from '@shared/const';
```

## 内容说明

### const.ts

包含客户端和服务器共用的常量定义：
- Cookie 名称
- 时间常量
- 其他共享配置

## 设计原则

1. **类型共享**: 公共类型定义集中在此目录
2. **常量共享**: 避免在客户端和服务器重复定义
3. **最小化依赖**: 此目录不应依赖客户端或服务器特定的代码

## 路径别名配置

在 `tsconfig.json` 和 `vite.config.ts` 中配置：

```json
{
  "paths": {
    "@shared/*": ["./shared/*"]
  }
}
```
