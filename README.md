# CNMemes.com — 中文梗典

Chinese Internet Meme Dictionary for English Speakers.  
526 memes from 2015-2026, with explanations, cultural context, and examples.

## 🚀 Quick Deploy to Vercel

### Step 1: Push to GitHub

```bash
# 在你的电脑上
cd cnmemes
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/cnmemes.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. 打开 https://vercel.com
2. 点 "Add New Project"
3. 选择你刚推上去的 `cnmemes` 仓库
4. Framework Preset 选 **Astro**
5. 点 "Deploy"
6. 等 1-2 分钟，部署完成

### Step 3: 绑定域名

1. 在 Vercel 项目设置 → Domains
2. 添加 `cnmemes.com`
3. 按照 Vercel 的提示，去 Namecheap 设置 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

## 🛠 本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:4321
npm run build    # 构建静态文件
npm run preview  # 预览构建结果
```

## 📁 项目结构

```
cnmemes/
├── src/
│   ├── data/memes.json          # 526条词条数据
│   ├── layouts/Base.astro       # 页面布局模板
│   ├── components/MemeCard.astro # 词条卡片组件
│   ├── pages/
│   │   ├── index.astro          # 首页
│   │   ├── about.astro          # 关于页
│   │   ├── meme/[slug].astro    # 词条详情页 (526个)
│   │   ├── year/[year].astro    # 年份归档页
│   │   └── tag/[tag].astro      # 标签归档页
│   └── styles/global.css        # 全局样式
├── public/robots.txt
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 📝 添加新词条

编辑 `src/data/memes.json`，按照现有格式添加新条目，然后重新部署即可。

## 🔧 更新 Astro 配置

修改 `astro.config.mjs` 中的 `site` 为你的域名。
