下面我按照你目前 **GuildrunHub MVP 阶段** 的定位，整理一个可以直接交给 AI 开发的 **Tier List 功能开发 PRD**。

核心思想：

> Tier List 不是一个简单排行榜页面，而是一个连接 **英雄数据库（Heroes）+ Build系统 + Guides内容** 的决策型页面。

它的价值不是告诉用户“谁是S级”，而是帮助用户：

> “我现在应该选择哪个英雄？为什么？怎么玩？”

---

# Guildrun Tier List 功能开发 PRD

## 1. 功能目标

### 功能名称

Guildrun Tier List

---

### 功能定位

提供 Guildrun 当前版本英雄强度排名，帮助玩家快速了解：

* 哪些英雄强势
* 哪些英雄适合新手
* 哪些英雄适合特定模式
* 英雄之间的优缺点
* 推荐 Build 和搭配

---

### SEO目标

主要覆盖关键词：

```
guildrun tier list
guildrun hero tier list
best heroes guildrun
best guildrun heroes
guildrun best characters
```

长尾：

```
guildrun red rift tier list
guildrun beginner heroes
guildrun nyx tier
guildrun irini tier
```

---

# 2. 页面结构

URL:

推荐：

```
/tier-list
```

不要放：

```
/guides/tier-list
```

原因：

Tier List 是一个长期核心页面，不是一次性文章。

类似：

```
/heroes
/relics
/builds
/tier-list
```

属于一级内容。

---

# 3. 页面整体结构

```
Tier List Page

|
├── Header
|
├── Introduction
|
├── Version Information
|
├── Tier Ranking Table
|
├── Hero Detail Cards
|
├── Ranking Methodology
|
├── FAQ
|
└── Related Content
```

---

# 4. 页面 Header

## H1

```
Guildrun Tier List - Best Heroes Ranked
```

---

## 简介

示例：

```
Our Guildrun Tier List ranks heroes based on current game balance, 
build flexibility, synergy potential, and performance in different modes.
```

---

## Version信息

非常重要。

Tier List 是时效内容。

增加：

```
Version:
Demo 0.5

Last Updated:
July 2026
```

数据结构：

```json
{
 "version":"0.5",
 "updatedAt":"2026-07-20"
}
```

---

# 5. Tier Ranking核心模块

## Tier分类

初始：

```
S Tier
A Tier
B Tier
C Tier
D Tier
```

不要过多。

---

展示：

例如：

```
S Tier

--------------------------------

Nyx
[Avatar]

Role:
DPS Carry

Why:
Excellent scaling damage

Best For:
Red Rift

View Guide


--------------------------------


Irini

Role:
Flexible Carry

Why:
Strong early and late game
```

---

# 6. 数据结构设计（重点）

Tier List必须和Hero数据库关联。

不要复制英雄数据。

---

## Hero基础数据

来自：

```
heroes
```

例如：

```json
{
"id":"nyx",
"name":"Nyx",
"avatar":"/images/heroes/nyx.png",
"class":"Duelist"
}
```

---

## Tier List数据

新增：

```
tier_list_entries
```

结构：

```json
{
"id":1,

"heroId":"nyx",

"tier":"S",

"rank":1,

"version":"0.5",

"role":"DPS Carry",

"summary":
"Strong scaling hero with excellent Rush synergy",

"strengths":[
 "High damage scaling",
 "Good late game"
],

"weaknesses":[
 "Needs protection"
],

"bestModes":[
 "Red Rift",
 "Endless"
],

"recommendedBuildId":
"nyx-rush-build"
}
```

---

# 7. 页面展示逻辑

前端：

读取：

```
TierListEntry
        |
        |
        v

Hero Database

        |
        |
        v

Hero Card
```

不要存：

```
Nyx头像
Nyx技能
Nyx名字
```

这些属于 Hero 数据。

---

关系：

```
Tier List

    |
    |
    v

Hero

    |
    |
    +---- Skills

    |
    |
    +---- Relics

    |
    |
    +---- Builds
```

---

# 8. Hero Tier Card组件

组件：

```
TierHeroCard
```

展示：

```
Avatar

Hero Name

Tier

Role

Short Description

Best Build

View Hero
```

示例：

```
--------------------------------

[N] Nyx

S Tier

DPS Carry

A scaling hero focused on Rush synergy.

Recommended:

Nyx Rush Build


[View Hero]

--------------------------------
```

---

# 9. 点击英雄后的关联

点击：

```
Nyx
```

跳转：

```
/heroes/nyx
```

Hero页面增加：

Tier模块：

```
Current Tier Ranking

S Tier

Rank #2

Recommended Build:

Nyx Rush Build
```

---

形成：

```
Tier List
    |
    |
Hero Page
    |
    |
Build Page
```

---

# 10. Ranking Methodology模块

非常重要。

因为Tier List属于观点内容。

需要解释：

## How We Rank Heroes

因素：

```
Damage Output

Survivability

Build Flexibility

Synergy Potential

Difficulty

Red Rift Performance
```

页面：

```
Tier rankings are based on:

- Current version balance
- Community feedback
- Testing results
- Performance across game modes
```

---

# 11. FAQ模块

SEO需要。

增加：

## FAQ Schema

问题：

```
What is the best hero in Guildrun?

Who is the strongest Guildrun hero?

Is Nyx good in Guildrun?

What is S Tier in Guildrun?
```

---

# 12. 后台管理（MVP）

由于你目前没有数据库，可以先使用静态JSON。

目录：

```
/data

tier-list.json

heroes.json
```

例如：

```
src/data/tierList.ts
```

内容：

```typescript
export const tierList=[
{
 hero:"Nyx",
 tier:"S",
 rank:1,
 description:"..."
}
]
```

---

未来数据库：

迁移：

```
tier_list_entries
```

即可。

---

# 13. 与其他模块关联

## Hero模块

Tier List：

引用Hero。

---

## Build模块

Tier：

推荐Build。

例如：

```
Nyx

S Tier

Recommended Build:

Nyx Rush Build
```

链接：

```
/builds/nyx-rush
```

---

## Guide模块

链接：

```
Red Rift Guide

Beginner Guide
```

---

# 14. MVP开发范围

目前不要做复杂投票系统。

第一版：

必须：

✅ Tier展示
✅ Hero关联
✅ Tier解释
✅ SEO Meta
✅ FAQ

暂时不要：

❌ 用户投票
❌ 自动排名算法
❌ Community Tier
❌ 多版本历史

---

# 15. 后续升级方向

## Version历史

例如：

```
Tier List History

0.5
0.4
0.3
```

---

## Mode Tier List

增加：

```
Red Rift Tier List

Endless Mode Tier List

Beginner Tier List
```

数据：

增加：

```json
{
 mode:"red-rift"
}
```

---

## Build推荐算法

未来：

用户选择：

```
Hero:
Nyx

Mode:
Red Rift

↓

推荐:

Build A
Build B
```

---

# 最终产品定位

你的 Tier List 不应该是：

```
S
A
B
C
```

一个排行榜。

而应该是：

```
Tier List
      |
      |
      ↓

英雄强度判断

      |
      |
      ↓

英雄详情

      |
      |
      ↓

Build推荐

      |
      |
      ↓

玩法攻略
```

这样它才符合 GuildrunHub 的长期方向：

**Game Database + Strategy Assistant**

而不是简单 Wiki。
