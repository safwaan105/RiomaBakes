"""
Create a PythonAnywhere ASGI web app for this backend using their official API.

Usage example:

python pythonanywhere_create_site.py ^
  --username YOUR_USERNAME ^
  --api-token YOUR_API_TOKEN ^
  --domain YOUR_USERNAME.pythonanywhere.com ^
  --project-path /home/YOUR_USERNAME/RiomaBakes/backend ^
  --venv-path /home/YOUR_USERNAME/.virtualenvs/riomabakes ^
  --host www.pythonanywhere.com

Before running:
1. Upload this repo to PythonAnywhere.
2. Create the virtualenv and install backend requirements.
3. Create backend/.env with MONGO_URL, DB_NAME, and CORS_ORIGINS.

Official references:
- https://help.pythonanywhere.com/pages/ASGIAPI/
- https://help.pythonanywhere.com/pages/environment-variables-for-web-apps/
"""

from __future__ import annotations

import argparse
from urllib.parse import urljoin

import requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--username", required=True)
    parser.add_argument("--api-token", required=True)
    parser.add_argument("--domain", required=True)
    parser.add_argument("--project-path", required=True)
    parser.add_argument("--venv-path", required=True)
    parser.add_argument(
        "--host",
        default="www.pythonanywhere.com",
        help="Use eu.pythonanywhere.com for EU accounts.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    api_base = f"https://{args.host}/api/v1/user/{args.username}/"
    headers = {"Authorization": f"Token {args.api_token}"}
    command = (
        f"{args.venv_path}/bin/uvicorn "
        "--uds ${DOMAIN_SOCKET} "
        "server:app"
    )

    response = requests.post(
        urljoin(api_base, "websites/"),
        headers=headers,
        json={
            "domain_name": args.domain,
            "enabled": True,
            "webapp": {
                "path": args.project_path,
                "command": command,
            },
        },
        timeout=60,
    )

    print(f"status={response.status_code}")
    print(response.text)


if __name__ == "__main__":
    main()
