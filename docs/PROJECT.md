# MultiDojo² — Research and usage guide

The World's First Self-Evolving Leaderboard for Heterogeneous Multi-Robot Collaboration.

[Quick start](#quick-start) · [Dataset](#dataset) · [Task IDs](#task-ids) · [Evaluation](#evaluation) · [RSI](#rsi) · [Deployment](#deployment) · [FAQ](#faq) · [中文说明](#中文说明)

MultiDojo² studies collaborative manipulation across homogeneous and heterogeneous robot teams. The scored suite covers **20+ task families with 2, 3, 4, or 8 arms**, complemented by research showcases of ten-robot fan assembly and humanoid–manipulator collaboration.

[Project website](https://worldagents-c.github.io/MultiDojo2/index.en.html) · [GitHub repository](https://github.com/worldAgents-c/MultiDojo2)

**Online evaluation is coming soon. [Download the 301-episode training release on Hugging Face](https://huggingface.co/datasets/WorldAgents-c/MultiDojo2).**

## Quick start

Explore the project locally with **Python 3.10+** and a modern browser:

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open `http://localhost:8000/`. The checker verifies links, asset hashes, public configuration, task counts, and release contents.

For the standalone website ZIP, serve the extracted directory instead:

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Use HTTP so the browser can load the task catalog and project resources.

## Dataset

The training collection comprises **2,000+ reviewed simulation episodes, with 100 demonstrations per task**. The **301-episode training release across all 20 task families** is [available on Hugging Face](https://huggingface.co/datasets/WorldAgents-c/MultiDojo2). It retains all camera streams, states/actions, calibration, and acceptance records. Per-task subset counts are listed in that repository’s `tasks.json`.

Each accepted episode provides:

- Synchronized 640×480 RGB from every arm's wrist/first-person camera and third-person cameras, with the camera list recorded per episode.
- Robot-specific joint states, velocities, absolute joint-position commands, feedforward effort, and next states.
- Joint names, native units, actuator masks, camera intrinsics/poses, instructions, and acceptance metadata.
- An original trajectory, an LMDB-backed observation/action recording, and terminal images for the final transition.

Use the release's **`train.jsonl`** as the authoritative episode index. Its accepted entries identify the reviewed training recordings and preserve their task and episode provenance.

### Alignment and action semantics

For transition `t`, RGB and state describe the world **before** action `t`; next-state/RGB describe the result at `t + 1`. The loader supplies terminal observations for the final transition.

Actions are **absolute native joint-position commands**. Revolute joints use radians and prismatic joints use metres, in the recorded per-robot joint order. Preserve joint dimensions, units, masks, and camera metadata when converting for a WAM or VLA. Apply model-specific normalization and padding explicitly.

### Loader example

The data release includes `loader.py`. From its directory, with `numpy`, `scipy`, `opencv-python`, and `lmdb` installed:

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

## Task IDs

The frozen suite uses zero-based IDs **00–19**. [task-catalog.json](assets/task-catalog.json) maps each ID to its canonical identifier, English/Chinese names, camera set, counts, and row spans in the training index.

`training_index_rows_1_based` gives line numbers in the full source index identified by `training_index_sha256`. The public training release has its own 301-row `train.jsonl`; use `tasks.json` and `source_training_index_row_1_based` in that dataset to map subset rows back to the collection. Join recordings by `task` and `episode`.

Trial `09-047` is the 48th zero-based trial of task 09, homogeneous four-arm ordered color-block stacking. Task 05 retains a historical `Banana` identifier; its manipulation object is a **long block**, passed from Franka to Piper and placed on the yellow target. Heterogeneous teams combine robot designs, with some models appearing more than once.

## Evaluation

Evaluation tests policies across varied environments and initial states under a common protocol. Each evaluation run records its task set, scene definitions, and trial budget for reproducible comparison.

Randomization changes permitted object/goal positions and scene appearance while preserving instructions, semantic colors, object identities, manipulation order, workspace feasibility, and physical requirements. Training episodes and exam scenes are separate inputs.

```text
Task success rate = successful trials / evaluated trials
Overall score = 100 × mean(success rates across evaluated task families)
```

Task-specific completion and physical checks cover the required grasp/contact, transfer/order, support, destination, and final stability. Forbidden collisions, failures, timeouts, and runtime errors count as failed trials. RSI provides diagnostic feedback alongside these objective scores.

The evaluation runtime uses GenManip/Isaac, CuRobo, and the corresponding robot/object assets. Its policy adapter defines observations, action semantics, and execution timing. The online evaluation service is coming soon.

Official results cover the declared evaluation task set, retain scene and execution evidence, and undergo independent review and organizer verification. Script experts and visual policies are reported in separate tracks.

For reproducibility, record the suite revision/hash, policy/checkpoint, observation modalities/cameras, training split, action semantics, execution budget, every trial outcome, all per-task success rates, and overall macro-average. Improvement studies use a pre-frozen re-test split separate from diagnosis and training inputs.

## RSI

**Replay → diagnosis → targeted scene candidates → physical validation → training → re-evaluation.**

RSI links execution evidence to failure explanations and concrete training objectives. A recommendation specifies the task, participating robots and roles, objects, initial/goal ranges, collaboration order, motion constraints, and acceptance conditions.

For example, a stacking-stability failure can lead to follow-up scenes that retain the original objects and order while varying placement positions and focusing on release, retreat, and support. Evidence and hypotheses are distinguished so researchers can investigate the relevant operation stage.

Candidate scenes enter training after native execution and complete data acceptance. Re-evaluation under frozen rules measures the effect of the next training round. See the [RSI interface guide](RSI-USER.zh.md) for the user workflow.

## Deployment

The project website supports GitHub Pages and repository subpaths. In **Settings → Pages**, select **GitHub Actions**. The included workflow validates and publishes `docs/`; pull requests run the same release checks.

To review changes locally:

```sh
python3 scripts/update_manifest.py
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

The manifest records file hashes. Review the rendered page and check results before publishing. See [RELEASE.md](https://github.com/worldAgents-c/MultiDojo2/blob/main/RELEASE.md) in the GitHub repository for deployment details.

## FAQ

**Which tasks contribute to the score?** The task families declared by the evaluation protocol and mapped in the task catalog. Fan assembly and humanoid–manipulator videos extend the collaboration showcases.

**How is the exam organized?** Scene variation follows the task instruction and physical criteria. Every run records its evaluated scenes and outcomes; task success rates form the overall macro-average.

**Which data should I use for training?** The synchronized observation/action release and its authoritative `train.jsonl` index. Website GIFs and MP4s illustrate the collection.

**Where can I download the dataset?** The [training data release on Hugging Face](https://huggingface.co/datasets/WorldAgents-c/MultiDojo2) provides 301 complete episodes across 20 tasks, approximately 98.1 GiB. Follow the dataset repository’s download, verification, and loader instructions.

**What is the license?** The original website code and documentation are [MIT licensed](LICENSE). Scope and attribution are documented in [NOTICE.md](NOTICE.md). Datasets, evaluation runtimes, and third-party assets retain their respective release terms.

## 中文说明

**MultiDojo² 面向同构与异构多机器人协作，连接多视角数据、随机化考试与 RSI 反馈。**

- **20+ 类协作任务**：覆盖双臂、三臂、四臂与八臂组合，包含交接、接力、共同搬运、顺序叠放和多工位并行操作。
- **2,000+ 条训练轨迹**：每类 100 条，同步保存每臂第一视角、第三视角、机器人状态与动作；以 `train.jsonl` 为正式训练索引。
- **随机化评测**：围绕环境条件、物体与终点位置及初始状态组织变化，记录场景与执行证据，按统一任务和物理标准评分，各任务等权参与总分。
- **RSI 评估**：依据回放与执行证据定位协作问题，将改进方向具体化为物体、起终点范围、机械臂分工及验收条件。场景通过物理与数据验收后进入补强训练，再通过复测检验效果。
- **协作研究展示**：同构十机器人、异构机器人，以及人形机器人与机械臂共同装配风扇，展现跨组合、跨形态的协作研究方向。

**线上测评服务即将上线。[首批训练数据已在 Hugging Face 开放下载](https://huggingface.co/datasets/WorldAgents-c/MultiDojo2)：301 条完整轨迹，覆盖 20 类任务，约 98.1 GiB。**

[浏览项目官网](https://worldagents-c.github.io/MultiDojo2/) · [访问 GitHub](https://github.com/worldAgents-c/MultiDojo2) · [RSI 使用指南](RSI-USER.zh.md)
