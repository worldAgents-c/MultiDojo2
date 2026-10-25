# Multidojo² — Research and usage guide

A Benchmark for Multi-Robot Collaboration.

[Quick start](#quick-start) · [Dataset](#dataset) · [Task IDs](#task-ids) · [Evaluation](#evaluation) · [RSI](#rsi) · [Deployment](#deployment) · [FAQ](#faq) · [中文说明](#中文说明)

Multidojo² studies collaborative manipulation across homogeneous and heterogeneous robot teams. The scored suite has 20 task families with 2, 3, 4, or 8 arms. Ten-robot fan assembly and humanoid–manipulator collaboration are separate research demonstrations, not additional scored tasks.

## Quick start

The website repository requires **Python 3.10+** and a modern browser. No extra Python packages, GPU, simulator, or API credentials are needed for this static preview.

From the downloaded repository root:

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open `http://localhost:8000/`. The checker verifies local links, asset hashes, public configuration, task counts, and release contents. It does not execute physics or certify a learned policy.

For the standalone website ZIP, serve the extracted directory instead:

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Use HTTP instead of `file://`, because the site reads its configuration and task catalog with `fetch`.

## Dataset

The training release comprises **2,000 reviewed simulation episodes: 100 per task**. Data are distributed separately from this website repository; a public download host has not yet been configured. The website ZIP and demo media are not the training dataset.

Each accepted episode provides:

- Synchronized 640×480 RGB from every arm's wrist/first-person camera and third-person cameras. The camera list is recorded per episode.
- Robot-specific joint states, velocities, absolute joint-position commands, feedforward effort, and next states.
- Joint names, native units, actuator masks, camera intrinsics/poses, instructions, and acceptance metadata.
- An original trajectory, an LMDB-backed observation/action recording, and terminal images for the final transition.

The release's `train.jsonl` is the authoritative episode index. Load accepted entries; recursively scanning demonstration folders can include older examples or rejected candidates. Existing GenManip identifiers remain for provenance; the public brand is Multidojo².

### Alignment and action semantics

For transition `t`, RGB and state describe the world **before** action `t`; next-state/RGB describe the result at `t + 1`. The loader supplies terminal observations for the final transition.

Actions are **absolute native joint-position commands**, not Cartesian deltas or a universal fixed-DOF vector. Revolute joints use radians and prismatic joints use metres, in the recorded per-robot joint order. Preserve joint dimensions, units, masks, and camera metadata when converting for a WAM or VLA. Apply model-specific normalization and padding explicitly.

### Loader example

After obtaining the separate data release and its accompanying `loader.py`, run this from that release's directory with its documented dependencies installed (`numpy`, `scipy`, `opencv-python`, `lmdb`):

```python
from loader import TrainingDataset

dataset = TrainingDataset("train.jsonl")
try:
    sample = dataset.step(episode=0, frame=0, action_horizon=8)
    print(sample["task"], sample["timestamp_s"])
    print(sample["images"].keys())
    for name, robot in sample["robots"].items():
        print(name, robot["joint_names"], robot["joint_units"])
        print(robot["state"].shape, robot["action_chunk"].shape)
    print(sample["action_chunk_mask"])
finally:
    dataset.close()
```

This uses the supplied loader's actual interface. Previewing the website does not install the loader or data. A redistributed dataset must document path relocation rather than publish machine-specific absolute paths.

## Task IDs

The frozen suite uses zero-based IDs **00–19**. [task-catalog.json](assets/task-catalog.json) maps each ID to its canonical identifier, English/Chinese names, camera set, counts, and row spans in the training index.

`training_index_rows_1_based` means line numbers in the exact index identified by `training_index_sha256`. It does not rename episode folders. Join recordings by `task` and `episode`.

Trial `09-047` is the 48th zero-based trial of task 09, homogeneous four-arm ordered color-block stacking. Historical task-05 names contain `Banana`, but its actual object is a **long block**, passed from Franka to Piper and placed on the yellow target. Heterogeneous teams may reuse some designs; every arm need not be a unique model.

## Evaluation

The exam has **100 frozen randomized initial scenes per task**. Initial scenes were natively validated and bound to a suite revision. This is distinct from completing 2,000 policy rollouts successfully. The public exam is reproducible, not a hidden test split.

Randomization changes permitted object/goal positions and scene appearance while preserving instructions, semantic colors, object identities, manipulation order, workspace feasibility, and physical requirements. Training data and exam scenes are separate inputs.

```text
Task success rate = successful trials / 100
Overall score = 100 × (sum of the 20 task success rates / 20)
```

Task-specific completion/physics checks include the required grasp/contact, transfer/order, support, destination, and final stability. Forbidden collisions, failures, timeouts, and runtime errors remain failed trials in the denominator. RSI cannot override these checks.

Native execution requires the **separately distributed public evaluation package**, original GenManip/Isaac runtime, CuRobo, and robot/object assets. This website repository is not a standalone simulator installation. Follow the evaluation package's README and policy adapter; a website demonstration is not a policy evaluation.

An official result must cover all 20 tasks, retain frozen-suite and execution evidence, pass independent review, and be signed by the organizer. Privileged script experts and visual policies have separate tracks. The expert baseline is incomplete; no complete model leaderboard score is currently published.

For reproducibility, retain the suite revision/hash, policy/checkpoint, observation modalities/cameras, training split, action semantics, execution budget, every trial outcome, all 20 task rates, and overall macro-average. Report failed runs rather than replacing them with easier scenes. Future improvement studies must isolate diagnosis/training inputs from a pre-frozen re-test split.

## RSI

**Replay → diagnosis → targeted scene candidates → physical validation → training → re-evaluation.**

The public interface exposes one RSI assessment action. Basic diagnosis connects execution facts to failure stages and concrete suggestions: task, robots/roles, objects, initial/goal ranges, operation requirements, and acceptance conditions.

For real failure `09-047`, stacking stability failed. A useful follow-up varies placements while retaining original objects and order and focuses on release, retreat, and support. A failed check identifies the condition; it does not prove an untested physical cause.

Suggested scenes remain **candidates** until native execution and complete data acceptance pass. The full external assessment service and automatic retraining integration are pending. No completed closed-loop learning gain is claimed. Private implementation, assessment mechanics, and credentials are not distributed. See [the public RSI interface guide](RSI-USER.zh.md).

## Deployment

The website uses relative paths and supports GitHub Pages repository subpaths. Enable **Settings → Pages → Source: GitHub Actions**. The included workflow validates before uploading `docs/`; pull requests also run the standard-library checker.

`docs/project-config.json` contains only public fields:

```json
{
  "brand": "Multidojo²",
  "deployment": "static",
  "official_site_url": null,
  "github_url": null,
  "live_benchmark_url": null
}
```

Replace `null` only with actual addresses. Remote addresses must use HTTPS. `live_benchmark_url` is the service root, not a leaderboard file or key. Static Pages explains unavailable live links until configured. It cannot run a private RSI service, evaluation worker, or training job.

## FAQ

**Are fan/humanoid videos scored tasks?** No. They are separate simulation research demonstrations. The three fan excerpts are edited at 3× source speed; overview footage is also edited.

**Does 2,000 exam scenes mean 2,000 successful trials?** No. These are validated initial scenes. Policy outcomes must be measured under the frozen rules.

**Can I train from the website GIFs/MP4s?** They are presentation excerpts. Use the separate synchronized observation/action release and authoritative index.

**Are data on a public host already?** This draft has no configured public dataset address. It does not invent a Hugging Face identifier or link.

**What is the license?** The original website code and documentation are [MIT licensed](LICENSE), with scope and attribution in [NOTICE.md](NOTICE.md). Separately distributed datasets, evaluation runtimes, and third-party assets retain their own release terms. A researcher author list and paper/citation can be added when supplied by the maintainers.

## 中文说明

下面保留原项目部署与接入说明。训练数据、公开考试场景、研究展示和网站仓库是不同产物；完整外部 RSI 与自动再训练尚待接入。

### 项目与集成说明

面向同构与异构多机器人协作的自进化评测平台。

项目介绍 `/`；评测工作台 `/leaderboard.html`；任务示范 `/previews.html`；原始考试与 RSI `/previews.html?mode=exam`。

## 当前能力与边界

- 20 类双臂、三臂、四臂、八臂操作；2,000 条已审核训练轨迹，保存各臂第一视角和第三视角。
- 当前公开考试版本为每类 100 场，共 2,000 个固定随机场景。提前冻结场景与哈希，失败、碰撞、超时和运行异常计零分。只有完整、独立复核并验签的结果可上榜；脚本专家和视觉策略分组展示。
- RSI 入口提供评估结论、改进方向和具体训练场景建议。完整评估服务尚待接入，当前明确标注基础诊断，没有自动训练提升结果。用户操作见 `RSI-USER.zh.md`；服务实现不在公开代码包内。
- 风扇装配录像是独立研究展示，不属于当前 20 个计分任务。首页片段为已审核录像的 3 倍速剪辑；素材哈希与剪辑时间见 `assets/fan-provenance.json`。
- 首页另有 84 秒协作总览，节选全部 2000 条不同训练轨迹及三套风扇展示；末段约 216 路同屏连续滚动。网页使用 1080p 版本，素材证明见 `assets/collaboration-provenance.json`。
- 当前训练来源的路径、旧版 schema 和冻结评估器沿用 GenManip 标识，以保持数据及成绩的可追溯性；公开产品名为 Multidojo²。

## 官网与 GitHub Pages

`web/project-config.json` 只包含公开信息：`official_site_url`、`github_url`、`live_benchmark_url`，尚未提供时为 `null`。不要在此文件放 API 密钥。提供真实地址后更新配置，重新构建静态站即可；按钮和 canonical 链接随配置生效。

在评测代码目录执行：

```sh
python publish_site.py --root /path/to/benchmark-root
```

输出 `benchmark-root/multidojo/site/` 和 `benchmark-root/downloads/multidojo-site.zip`。站点包含三组风扇短片、六张任务示范与本文档，无本机数据盘路径、私钥或考试原始大文件。解压后以 HTTP 静态服务预览，不使用 `file://` 直接打开。

同时输出 `multidojo/github-repository/` 与 `downloads/multidojo-github.zip`：根 README、`docs/` 静态官网、`.github/workflows/pages.yml` 和 `.gitignore`。`repository.html` 是从同一份 README 模板实际生成的本地排版预览，不是已经发布的 GitHub 仓库。仓库草稿只包含项目网站与部署文件，评测代码包和大型训练数据独立分发；不含 RSI 私有实现或凭据。

独立 GitHub 仓库可将站点文件置于 `docs/`，在 Settings → Pages 中选择发布分支及 `/docs`。无需 Node、构建服务或后端。所有静态资源使用相对路径，支持 `/仓库名/` 子路径和独立域名。GitHub Pages 只提供介绍站，不能执行 Python 评估器或承载 API。实时榜单需部署独立评测服务，再将其完整 HTTPS 根地址配置为 `live_benchmark_url`。

若使用仓库草稿中附带的 Actions 工作流，在 Settings → Pages 中将 Source 设为 GitHub Actions；工作流发布 `docs/`。静态解压预览可直接运行 `python3 -m http.server 8000 --directory docs`。GitHub 页面的视频使用约 39 MiB 的 1080p 文件；约 137 MiB 的 4K 母版保留为独立成品，没有放入 Git 仓库。单文件限制与静态站说明见 [GitHub 官方文档](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) 和 [Pages 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

网站原创代码与文档采用 [MIT 许可证](LICENSE)，范围与第三方归属见 [NOTICE.md](NOTICE.md)。官网与仓库地址读取发布配置；作者名单、论文与实际数据下载地址由维护者补充。训练数据与评测代码包独立分发，评测执行仍依赖原 GenManip / Isaac 环境与资产。

## 自进化服务接入约定（待真实 API 适配）

RSI 评估与再训练由组织方服务端接入，用户无需配置内部模型或密钥。公开接口只提供评估结果和训练建议；服务配置与实现由组织方维护。

训练 API 尚未给出，当前不会发送任何训练请求。接入时以已实现的 `/api/rsi/export?trial=09-047` JSON 为输入基础，服务端适配层需映射以下协议：

1. 提交训练作业：版本化 `schema`、`idempotency_key`、模型初始 checkpoint 标识、训练 split 清单与 SHA、RSI bundle 与 SHA、选定 recipe ID、预算（训练步数 / 样本上限 / 超时）、输出目的地。密钥仅置于请求 Authorization 头，不能进入场景文件、网页、日志或 URL。
2. 返回作业标识与状态：`queued / running / succeeded / failed / cancelled`；重复的幂等键返回同一作业。轮询返回真实进度、错误及最终 checkpoint URI 和 SHA，不以一次 HTTP 200 当作训练成功。
3. 场景导出只产生候选：先执行原生仿真并通过既有抓取、支撑、碰撞、放置、同步图像与文件完整性检查，再进入训练集；失败候选剔除并记录原因，不能仅凭诊断建议宣布成功。
4. 训练后的模型使用新的预先冻结复测 split，与诊断 / 补强样本隔离。每类复测 100 次，记录模型 SHA、训练预算、种子与场景清单 SHA，报告各任务 SR、宏平均 SR、相对基线的变化及置信区间。公开当前考试场景不属于隐藏测试集。
5. 再训练失败不得覆盖原模型或已有成绩。独立复核并由组织方评估器验签后再上榜；外部训练服务无权访问评估签名私钥。RSI 说明及训练 API 的自报分数均不能改变官方分数。

真实 API 的鉴权方式、作业路径、轮询 / 回调和 checkpoint 格式到位后，再完成对应适配与端到端小规模测试。当前已经准备数据入口、输出约定与静态部署，但没有声称完成未知协议的自动训练对接。
