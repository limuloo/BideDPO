# BideDPO: Conditional Image Generation with Simultaneous Text and Condition Alignment

> Preprint · Code and benchmarks will be released

![Teaser](static/teaser.png)

## Abstract

Conditional image generation augments text-to-image synthesis with structural, spatial, or stylistic priors and is used in many domains. However, current methods struggle to harmonize guidance from both sources when conflicts arise: 1) input-level conflict, where the semantics of the conditioning image contradict the text prompt, and 2) model-bias conflict, where learned generative biases hinder alignment even when the condition and text are compatible. These scenarios demand nuanced, case-by-case trade-offs that standard supervised fine-tuning struggles to deliver. Preference-based optimization techniques, such as Direct Preference Optimization (DPO), offer a promising solution but remain limited: naive DPO suffers from gradient entanglement between text and condition signals and lacks disentangled, conflict-aware training data for multi-constraint tasks. To overcome these issues, we propose a self-driven, bidirectionally decoupled DPO framework (BideDPO). At its core, our method constructs two disentangled preference pairs for each sample—one for the condition and one for the text—to mitigate gradient entanglement. The influence of these pairs is then managed by an Adaptive Loss Balancing strategy for balanced optimization. To generate these pairs, we introduce an automated data pipeline that iteratively samples from the model and uses vision-language model checks to create disentangled, conflict-aware data. Finally, this entire process is embedded within an iterative optimization strategy that progressively refines both the model and the data. We construct a DualAlign benchmark to evaluate a model’s ability to resolve conflicts between text and condition, and experiments on commonly used modalities show that BideDPO delivers substantial gains in both text success rate (e.g., +35%) and condition adherence. We also validated the robustness of our approach on the widely used COCO dataset. All models, code, and benchmarks will be released to support future work.

## Highlights

- Bidirectionally decoupled preference pairs for text and condition.
- Adaptive Loss Balancing to avoid gradient entanglement.
- Self-driven data pipeline with VLM checks for conflict-aware pairs.
- Iterative optimization that refines both model and data together.
- DualAlign benchmark for evaluating text–condition conflict resolution.
- Strong gains in text success rate and condition adherence; robust on COCO.

## Getting Started

- Code release is in preparation. This repository will host:
  - Training scripts for BideDPO.
  - DualAlign benchmark and evaluation tools.
  - Example configs and inference demos.
- Environment (planned): Python 3.10+, PyTorch 2.x, diffusers, transformers, accelerate.

## Citation

If you find BideDPO useful, please cite the paper:

```bibtex
@article{bidedpo2025,
  title   = {BideDPO: Conditional Image Generation with Simultaneous Text and Condition Alignment},
  author  = {To be updated},
  journal = {arXiv preprint arXiv:xxxx.xxxxx},
  year    = {2025}
}
```

## Acknowledgements

We thank the open-source community around diffusion models and preference optimization for inspiring this work.