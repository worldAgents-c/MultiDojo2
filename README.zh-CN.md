<p align="center"><img src="docs/assets/mark.png" width="64" alt="Multidojo² 标志"></p>

<h1 align="center">Multidojo²</h1>

<p align="center"><strong>面向多机器人协作的评测基准</strong></p>

<p align="center"><a href="README.md" lang="en">English</a> · <strong>简体中文</strong></p>

<p align="center"><a href="https://worldagents-c.github.io/Multidojo/">项目官网</a> · <a href="#dataset">数据集</a> · <a href="#tasks">任务</a> · <a href="#evaluation">评测</a> · <a href="#rsi">RSI</a> · <a href="#quick-start">快速开始</a></p>

| 训练示范 | 任务类别 | 机器人组合 | 评测场景 |
| :---: | :---: | :---: | :---: |
| **2,000** | **20** · 每类 100 条 | **2 / 3 / 4 / 8 臂** | **2,000** · 每类 100 场 |

<a id="collaboration-in-action"></a>

## 看见协作

[![十台同构机械臂协作组装风扇](docs/assets/fan-isomorphic.gif)](docs/assets/fan-isomorphic.mp4)

<p align="center"><a href="docs/assets/fan-isomorphic.mp4">▶ 观看十臂风扇装配</a> · <a href="docs/assets/collaboration-overview.mp4">观看协作总览</a></p>

十台相同机械臂共同完成装配工序，在工位间传递工件、配合操作，一步步组装出完整风扇。

<a id="dataset"></a>

## 数据集

**20 类协作操作任务，2,000 条经审核的仿真示范。** 每类 100 条轨迹，覆盖物体交接、区域接力、共同搬运、顺序叠放与并行操作。

[![同一条轨迹的四路同步视角，与机器人状态和动作对齐](docs/assets/dataset-perspectives.png)](docs/assets/dataset-perspectives.png)

- **既看局部操作，也看团队配合。** 每个机械臂均有第一视角，并配有共享工作空间的第三视角。在同一时间线上观察抓取细节与机械臂之间的协作。
- **观测与动作同步记录。** RGB、机器人状态、原生关节指令、下一时刻观测与相机标定，保留感知和执行之间的对应关系。
- **覆盖不同机器人组合。** 同构与异构团队包含双臂、三臂、四臂和八臂，保留各机器人原生关节顺序、单位及执行器掩码。
- **具有实际意义的场景变化。** 在保持操作目标的前提下，改变物体与终点位置、工作空间分布和场景外观。
- **逐条进行物理与完整性验收。** 检查抓取与接触、物体支撑、放置稳定性、机械臂间禁止碰撞约束、图像同步和文件完整性。

**数据集下载即将开放。**

[数据格式与加载示例 →](docs/PROJECT.md#dataset) · [机器可读的任务目录 →](docs/assets/task-catalog.json)

<br>

<a id="collaboration-across-embodiments"></a>

## 跨形态协作

### 异构机器人团队

[![不同型号机械臂共同组装风扇](docs/assets/fan-heterogeneous.gif)](docs/assets/fan-heterogeneous.mp4)

不同机械臂在同一装配流程中承担互补角色，围绕共享工件完成传递与操作。

<p align="center"><a href="docs/assets/fan-heterogeneous.mp4">▶ 观看异构风扇装配</a></p>

<br>

### 人形机器人与机械臂

[![人形机器人与机械臂共同完成风扇装配](docs/assets/fan-humanoid.gif)](docs/assets/fan-humanoid.mp4)

人形机器人与机械臂跨越本体形态差异，在连续装配工序中分工配合。

<p align="center"><a href="docs/assets/fan-humanoid.mp4">▶ 观看人形与机械臂协作</a></p>

*研究展示 · 仿真录像以 3 倍速剪辑。风扇装配展示与下方 20 类计分操作任务共同呈现多机器人协作的研究方向。*

## All-to-One. One-to-All.

**机器人自动化的规模化发展，离不开协作。** 共享任务需要共享的工作空间理解、相互配合的操作时序，以及适合各机器人分工的动作。

**All-to-One** 将多机器人的观测与状态汇聚为统一的世界认知；**One-to-All** 将共享认知转化为适合各机器人本体与角色的协同行动。**One World, One Model** 表达了这一研究愿景。

![All-to-One 汇聚观测与状态，One-to-All 协调不同机器人团队的行动](docs/assets/collaboration-principle.png)

<a id="tasks"></a>

## 任务

任务集围绕 **五类协作技能** 展开：交接、接力、共同搬运、叠放与并行操作。每个任务对应 **100 条训练示范** 和 **100 个可复现评测场景**。

| ID | 任务 | 团队 | 协作技能 |
| --- | --- | --- | --- |
| 00 | 双臂香蕉空中交接入锅 | 同构 · 2 臂 | 交接 |
| 01 | 双臂香蕉苹果入盘 | 同构 · 2 臂 | 并行操作 |
| 02 | 双臂共同搬纸箱 | 同构 · 2 臂 | 共同搬运 |
| 03 | 双臂杯子两段接力 | 同构 · 2 臂 | 接力 |
| 04 | 双臂积木叠放 | 同构 · 2 臂 | 叠放 |
| 05 | Franka/Piper 长方块空中交接 | 异构 · 2 臂 | 交接 |
| 06 | 同构三臂方块接力 | 同构 · 3 臂 | 接力 |
| 07 | 同构四臂苹果入篮 | 同构 · 4 臂 | 并行操作 |
| 08 | 同构四臂方块接力 | 同构 · 4 臂 | 接力 |
| 09 | 同构四臂四色叠放 | 同构 · 4 臂 | 叠放 |
| 10 | 同构四臂饼干入盒 | 同构 · 4 臂 | 并行操作 |
| 11 | 同构四臂日用品入盒 | 同构 · 4 臂 | 并行操作 |
| 12 | 同构八臂方块入盒 | 同构 · 8 臂 | 并行操作 |
| 13 | 异构三臂方块接力 | 异构 · 3 臂 | 接力 |
| 14 | 异构四臂方块接力 | 异构 · 4 臂 | 接力 |
| 15 | 异构八臂方块入盒 | 异构 · 8 臂 | 并行操作 |
| 16 | 异构三臂香蕉接力 | 异构 · 3 臂 | 接力 |
| 17 | 异构三臂白杯接力 | 异构 · 3 臂 | 接力 |
| 18 | 异构四臂香蕉接力 | 异构 · 4 臂 | 接力 |
| 19 | 异构四臂白杯接力 | 异构 · 4 臂 | 接力 |

<details>
<summary>任务原始标识</summary>
<pre>00  BananaDualArmHandover
01  IsomorphicDualArm/BananaAppleToPlates
02  IsomorphicDualArm/CollabLiftLongBox
03  IsomorphicDualArm/CupLeftToMidToRight
04  IsomorphicDualArm/LeftPlaceRightStack
05  HeterogeneousDualArm/FrankPiperBananaHandover
06  IsomorphicTripleArm/BlockZoneRelay
07  IsomorphicQuadArm/AppleToBasket
08  IsomorphicQuadArm/BlockZoneRelay
09  IsomorphicQuadArm/ColorBlockCenterStack
10  IsomorphicQuadArm/CookieToBox
11  IsomorphicQuadArm/HouseholdToBox
12  IsomorphicOctaArm/BlocksToBoxes
13  HeterogeneousTripleArm/BlockZoneRelay
14  HeterogeneousQuadArm/BlockZoneRelay
15  HeterogeneousOctaArm/BlocksToBoxes
16  HeterogeneousTripleArm/BananaZoneRelay
17  HeterogeneousTripleArm/WhiteCupZoneRelay
18  HeterogeneousQuadArm/BananaZoneRelay
19  HeterogeneousQuadArm/WhiteCupZoneRelay</pre>
</details>

[任务目录](docs/assets/task-catalog.json) 将 **00–19** 号任务与任务名称、相机集合、训练索引中的轨迹范围对应起来。[任务与标识说明 →](docs/PROJECT.md#task-ids)

<a id="evaluation"></a>

## 评测

**在受控的场景变化中检验协作。** 每类任务提供 100 个冻结随机场景，改变物体与终点位置及允许变化的外观，同时保持任务指令和物理要求。

```text
任务成功率 = 成功试次 / 100
总分 = 100 × 20 类任务成功率的平均值
```

成功判定结合任务完成情况与真实抓取、交接顺序、物体支撑、终点位置、稳定性及碰撞约束。各任务等权参与总分，执行记录支持复现与复核。

**线上测评服务即将上线。**

[评测协议与策略使用指南 →](docs/PROJECT.md#evaluation)

## RSI

**把回放证据转化为具体的训练目标。** RSI 连接执行记录、失败说明与后续训练任务，帮助研究者明确策略下一步需要练习什么。

[![RSI 工作流：回放、诊断、任务定义、物理验证、训练与复测](docs/assets/rsi-workflow.png)](docs/assets/rsi-workflow.png)

训练建议具体到参与的机器人、操作物体、起点与终点范围、协作顺序、运动约束和成功条件。候选场景通过原生物理验收后进入训练，再通过复测衡量下一轮训练的效果。

[RSI 工作流说明](docs/PROJECT.md#rsi) · [RSI 使用指南 →](docs/RSI-USER.zh.md)

<a id="quick-start"></a>

## 快速开始

使用 **Python 3.10+** 在本地浏览项目：

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

打开 [localhost:8000](http://localhost:8000/)，浏览数据集介绍、任务目录和评测指南。

[研究与使用指南](docs/PROJECT.md#中文说明) · [相关研究](docs/RELATED_WORK.md) · [部署指南](docs/PROJECT.md#deployment)

提出问题或贡献时，请附上任务 ID、轨迹或试次 ID，以及复现步骤。

网站代码与文档：[MIT 许可证](docs/LICENSE) · [素材与第三方归属](docs/NOTICE.md)。

<br>

<a id="one-collection-thousands-of-collaborative-moments"></a>
<a id="2000-trajectories-in-motion"></a>

## 2,000 条轨迹，汇成协作图景

[![多机器人协作场景持续滚动的视频墙](docs/assets/trajectory-wall.gif)](docs/assets/trajectory-wall.mp4)

<p align="center"><a href="docs/assets/trajectory-wall.mp4">▶ 浏览完整场景墙 · 4K · 54 秒</a></p>

从双臂交接到八臂工位：约 **216 个场景同时播放**，连续呈现多机器人训练轨迹，并穿插装配研究展示。
