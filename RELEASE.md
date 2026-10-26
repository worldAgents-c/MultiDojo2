# Release and deployment

MultiDojo² brings together the project website, documentation, task catalog, and collaborative manipulation showcases. The repository includes automated checks and a GitHub Pages deployment workflow.

## Preview and verify

Use **Python 3.10+**:

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open `http://localhost:8000/`. Release checks validate file hashes, local links and anchors, the task catalog, and training-index row mappings.

## GitHub Pages

In repository **Settings → Pages**, select **GitHub Actions**. Pushes to `main` or `master` validate and publish `docs/`; pull requests run validation. The website uses relative resource paths and supports repository subpaths.

After editing published files, refresh the manifest and run the checker:

```sh
python3 scripts/update_manifest.py
python3 scripts/check_release.py
```

Review the page at desktop and mobile sizes before publishing.

## Dataset and evaluation

MultiDojo² brings together a 2,000+ demonstration collection across 20+ collaborative task families and randomized evaluation of varied scene conditions and initial states. The [training data collection](https://huggingface.co/datasets/WorldAgents-c/MultiDojo2) is being progressively released on Hugging Face. Online evaluation is coming soon. [Research and usage guide](docs/PROJECT.md).

## License and attribution

The original website code and documentation are MIT licensed. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for scope and attribution. Datasets, evaluation runtimes, and third-party assets retain their respective release terms.
