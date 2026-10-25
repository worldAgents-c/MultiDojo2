# Release and deployment

Multidojo² brings together the project website, documentation, task catalog, and collaborative manipulation showcases. The repository includes automated checks and a GitHub Pages deployment workflow.

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

The project describes 2,000 training demonstrations and 2,000 frozen evaluation scenes across 20 task families. Dataset downloads and online evaluation are coming soon. [Research and usage guide](docs/PROJECT.md).

## License and attribution

The original website code and documentation are MIT licensed. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for scope and attribution. Datasets, evaluation runtimes, and third-party assets retain their respective release terms.
