# Publishing this repository

This folder is the uploadable **website and documentation repository**. It contains media, a static project site, and automated checks. The training dataset, evaluation runtime, and native simulator assets are separate distributions.

## Preview and verify

```sh
python3 scripts/check_release.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open `http://localhost:8000/`. Python 3.10+ is sufficient. The checker validates the actual files, local links/anchors, task/row mapping, configuration and manifest hashes. It does not run a policy or certify physics.

## GitHub Pages

Upload the entire folder, including `docs/`, `scripts/`, `.github/`, README and this file. In repository Settings → Pages, select **GitHub Actions**. Pushes to `main` or `master` validate and publish `docs/`; pull requests validate without deploying. No Node/npm installation is required.

`docs/project-config.json` holds the actual public website, GitHub, and live-service roots. Unconfigured addresses stay `null`. A static Pages site works without a live benchmark; its service links explicitly explain their availability.

If editing static files after export, refresh `docs/manifest.json` with:

```sh
python3 scripts/update_manifest.py
python3 scripts/check_release.py
```

This records changed bytes; it does not replace reviewing the change. Do not change the task catalog or original provenance to fix a failing check.

## License and research metadata

The original website code and documentation are MIT licensed. See LICENSE and NOTICE.md for scope and third-party attribution. The training dataset and evaluation runtime are separate releases with their own terms. Researcher author lists, paper/citation, and public data download addresses can be added when supplied by the maintainers. Website media are simulation research demonstrations; third-party runtime and assets retain their own terms.

The current exam is 2,000 validated frozen initial scenes, not a claim of 2,000 successful policy executions. Full external RSI and automatic retraining are pending; there is no complete model leaderboard score or closed-loop improvement result. Keep those availability statements accurate when enabling services later.
