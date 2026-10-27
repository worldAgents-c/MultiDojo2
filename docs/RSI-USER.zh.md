# RSI 评估

**从执行回放定位协作问题，将失败分析转化为具体的训练任务。**

线上测评服务即将上线。

## 使用流程

在考试回放中选择一条已结束的记录，点击 **RSI 评估**，查看评估进度、问题说明和训练建议。

评估围绕执行过程组织证据，指出问题发生的阶段、涉及的机械臂与物体，以及影响任务完成的操作条件。对于运行异常和证据不足的情况，结果会说明需要进一步检查的信息。

## 读懂评估结果

- **问题定位**：关联回放中的操作阶段与执行记录，说明协作在哪里失效。
- **原因分析**：结合抓取、交接、放置和支撑等任务要求，区分已观察到的事实与需要验证的原因。
- **补强任务**：明确参与的机械臂及分工、操作物体、起点与终点范围、协作顺序、运动约束和成功条件。

例如，双臂交接出现接收位置偏差时，补强任务可保留原物体与交接顺序，围绕接收区域组织位置变化，并以稳定接住、准确放置和满足禁止碰撞约束作为验收条件。

## 从建议到下一轮训练

训练建议可导出为场景候选。候选经过原生仿真执行，并通过抓取、支撑、碰撞、放置稳定性及数据完整性验收后，进入补强训练。

训练后的策略在独立冻结场景中复测，用各任务成功率和整体成绩追踪改进效果。**RSI 反馈辅助诊断与训练，正式成绩依据统一任务和物理标准计算。**

## English

**RSI connects execution replays to failure diagnosis and specific follow-up training tasks.** Online evaluation is coming soon.

### Workflow

Select a completed evaluation replay and choose **RSI assessment** to view assessment progress, findings, and training recommendations. The report identifies the operation stage, participating robots and objects, and the conditions that affected task completion. Runtime failures or insufficient evidence are reported with the information needed for further investigation.

### Reading a report

- **Locate the problem:** relate the relevant operation stage to the recorded execution evidence.
- **Analyze the cause:** consider grasping, handover, placement, and support requirements, distinguishing observed facts from causes that still need verification.
- **Define targeted practice:** specify robot roles, objects, initial and goal position ranges, collaboration order, motion constraints, and success conditions.

For example, a receiving-position error in a two-arm handover can lead to follow-up scenes that preserve the object and handover order while varying the receiving region. Successful reception, accurate placement, and compliance with collision constraints define acceptance.

### From recommendations to training

Recommendations can be exported as candidate scenes. Candidates enter training after native simulation execution and acceptance checks covering grasping, support, prohibited collisions, placement stability, and complete data recording. Re-evaluate the trained policy on independent frozen scenes and track per-task success rates and the overall score. **RSI supports diagnosis and training; official scores follow the common task and physical criteria.**
