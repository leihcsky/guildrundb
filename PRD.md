**我赞同你这个思路，而且我觉得这是目前最符合你情况的方案。**

其实我们前面已经把架构想得比较远了，但**对于 Guildrun 这个项目来说，最重要的是"验证方向"，而不是"打造框架"。**

如果是我来做，我会把开发拆成两个阶段：

> **Phase 1（1~3 天）**
>
> 做一个能上线、能被 Google 收录、后期还能平滑升级的 MVP。

> **Phase 2**
>
> 当 Guildrun 确认有流量以后，再把 JSON 换成数据库，再开发 Admin。

所以第一版我甚至**不会用 MySQL，也不会做后台。**

---

# 我建议的技术路线

## 不做

❌ MySQL

❌ Prisma

❌ Admin

❌ 登录

❌ API

---

## 使用

```text
Next.js 15
React 19
TypeScript
TailwindCSS
shadcn/ui
```

数据全部放：

```text
/content

    heroes.json

    relics.json

    items.json

    builds.json

    guides.json
```

读取 JSON。

生成页面。

---

以后：

```text
JSON

↓

Database
```

几乎不用改页面。

---

# 下面就是我建议交给 AI 的 PRD（MVP 版）

---

# Guildrun DB MVP PRD

Version：0.1

---

# 一、项目目标

开发一个专注于 **Guildrun** 的数据库网站（Database），定位为：

> **不是 Wiki，不是新闻站，而是面向玩家的数据查询与攻略网站。**

首版目标：

* 快速上线
* SEO 友好
* 可扩展
* 后续可升级数据库

MVP 不考虑后台管理系统。

所有数据采用本地 JSON 管理。

---

# 二、技术栈

## Framework

* Next.js 15（App Router）
* React 19
* TypeScript

## UI

* TailwindCSS
* shadcn/ui
* Lucide Icons

## 部署

* Cloudflare Pages

## 数据

全部使用 JSON。

例如：

```text
/content

    heroes.json

    relics.json

    items.json

    builds.json

    guides.json
```

禁止接数据库。

---

# 三、目录结构

```text
/app

    page.tsx

    heroes/

    relics/

    items/

    builds/

    guides/

    search/

/components

/content

/lib

/types

/public
```

---

# 四、网站导航

Header：

```text
Logo

Home

Heroes

Relics

Items

Builds

Guides

Search
```

右侧：

```text
Dark Mode

Search
```

---

# 五、首页

首页包含：

---

## Hero Search

输入：

```text
Search Hero...
```

支持实时搜索。

---

## Featured Heroes

显示：

6 个 Hero。

---

## Featured Relics

显示：

6 个 Relic。

---

## Latest Guides

显示：

最新 Guide。

---

## Quick Navigation

卡片：

```text
Heroes

Items

Relics

Builds

```

---

Footer：

```text
About

Privacy

Contact

```

---

# 六、Heroes

列表页：

```
/heroes
```

功能：

支持：

搜索

支持：

Filter：

```text
Class

Role
```

排序：

```text
A-Z

Updated
```

Hero Card：

包含：

* Image
* Name
* Class
* Role

点击：

进入详情。

---

Hero Detail：

```
/heroes/{slug}
```

页面：

Hero Name

Hero Image

Overview

Stats

Passive

Abilities

Recommended Relics

Recommended Items

Recommended Builds

Tips

Related Heroes

---

# 七、Relics

```
/relics
```

支持：

搜索。

Filter：

```text
Rarity

Type
```

详情：

Image

Effect

Unlock

Best Heroes

Best Builds

Related Relics

---

# 八、Items

```
/items
```

详情：

Image

Stats

Source

Recommended Heroes

---

# 九、Builds

```
/builds
```

Build：

包含：

Title

Overview

Core Heroes

Core Relics

Core Items

Playstyle

Strength

Weakness

---

# 十、Guides

首版：

仅支持：

Markdown。

Guide：

包含：

Title

Description

Content

Updated

---

# 十一、Search

统一搜索：

Hero

Relic

Item

Guide

搜索框：

实时过滤。

---

# 十二、JSON 数据格式

Hero：

```json
{
  "id": "aria",
  "slug": "aria",
  "name": "Aria",
  "class": "Mage",
  "role": "DPS",
  "image": "/heroes/aria.webp",
  "overview": "",
  "stats": {},
  "passive": "",
  "abilities": [],
  "recommendedRelics": [],
  "recommendedItems": [],
  "recommendedBuilds": []
}
```

Relic：

```json
{
  "id": "",
  "slug": "",
  "name": "",
  "rarity": "",
  "effect": "",
  "image": ""
}
```

Item：

```json
{
  "id": "",
  "slug": "",
  "name": "",
  "type": "",
  "stats": ""
}
```

Build：

```json
{
  "slug": "",
  "title": "",
  "overview": "",
  "heroes": [],
  "relics": [],
  "items": []
}
```

---

# 十三、SEO

每个页面：

自动生成：

Title

Description

OpenGraph

Twitter Card

Canonical

JSON-LD

Breadcrumb

URL：

全部：

```text
/heroes/aria

/relics/fire-ring

/items/magic-book
```

禁止：

Query 参数。

---

# 十四、UI 风格

整体：

Dark Mode。

游戏风格。

参考：

* Maxroll
* PoE2DB
* Mobalytics

要求：

* 卡片布局
* 大量留白
* Hover 动画
* 响应式

---

# 十五、MVP 不做

第一版：

不要：

```text
登录

后台

评论

收藏

数据库

Prisma

API

权限

国际化

广告

Analytics Dashboard
```

全部：

后期。

---

# 十六、代码要求（重点）

整个项目必须遵循：

* TypeScript Strict Mode
* ESLint + Prettier
* App Router
* Server Component 优先
* Client Component 仅用于交互
* 所有数据统一从 `/content` 读取，不允许在组件中写死数据
* 页面组件与 UI 组件分离
* 所有 SEO 元数据通过 `generateMetadata()` 生成
* 所有图片统一放在 `/public`
* 保持代码可维护，为后续接入数据库预留接口层（例如统一通过 `lib/data.ts` 读取数据，而不是直接 import JSON）

---

# 🚀 我还建议增加一个 AI 开发原则（这是我认为最重要的一条）

如果这份 PRD 是交给 Cursor、Claude Code 或 Codex 来开发，我会在最后增加一个 "**开发原则**"：

> **不要为了未来的扩展而增加当前 MVP 不需要的复杂度，但所有代码都应为未来升级做好边界隔离。**

例如：

* 今天使用 JSON，但所有页面都通过 `lib/data.ts` 获取数据，未来只需要替换这一层即可接入数据库。
* 今天没有后台，但内容结构、类型定义、Slug 规则都按照未来数据库设计。
* 今天只有 Guildrun，一个游戏，但页面不要写死 `Guildrun` 字符串，而是统一从 `site.config.ts` 获取站点配置（站点名称、Logo、SEO 信息等）。

这样，你能在 **2～3 天内完成一个可以上线的 MVP**，如果后续 Guildrun 真的验证成功，再逐步演进到我们之前讨论的 **GameDB Framework**。不会推倒重来，也不会因为过度设计拖慢上线速度。

**我认为这是目前最符合你目标（快速验证 + 长期可扩展）的方案。**
