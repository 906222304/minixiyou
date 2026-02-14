# Spec-Kit 工作流配置

本目录包含 MiniXiyouDream 项目的 Spec-Driven Development 工作流配置。

## 目录结构

```
.specify/
├── memory/           # 项目记忆
│   └── constitution.md   # 项目原则和开发规范
└── templates/        # 文档模板
    ├── spec-template.md  # 功能规格模板
    ├── plan-template.md  # 技术计划模板
    └── task-template.md  # 任务清单模板
```

## 工作流阶段

| 阶段 | 产出物 | 描述 |
|------|--------|------|
| Specify | spec.md | 定义功能需求、用户故事、验收标准 |
| Plan | plan.md | 技术方案、模块设计、接口定义 |
| Tasks | tasks.md | 任务分解、依赖关系、进度追踪 |
| Implement | 代码 | 按任务顺序实现功能 |
| Test | 验证 | 类型检查、功能测试 |
| Maintain | 更新 | 文档同步、代码优化 |

## 使用方法

### 开始新功能开发

```bash
# 1. 创建规格目录
mkdir -p specs/[feature-name]

# 2. 复制模板
cp .specify/templates/spec-template.md specs/[feature-name]/spec.md
cp .specify/templates/plan-template.md specs/[feature-name]/plan.md
cp .specify/templates/task-template.md specs/[feature-name]/tasks.md

# 3. 按顺序填写文档
# 先 spec.md -> 再 plan.md -> 最后 tasks.md
```

### 开发顺序

1. **spec.md** - 明确做什么
   - 定义用户故事
   - 列出验收标准
   - 识别数据需求

2. **plan.md** - 确定怎么做
   - 设计模块结构
   - 规划数据流
   - 定义接口

3. **tasks.md** - 拆分具体任务
   - 按依赖排序
   - 标注优先级
   - 追踪进度

4. **实现** - 按任务编码
   - types -> constants -> signals -> services -> components

5. **验证** - 确保质量
   - `npx tsc --noEmit`
   - 功能测试

## 参考资料

- [GitHub Spec-Kit](https://github.com/github/spec-kit)
- [Spec-Driven Development 官方文档](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
