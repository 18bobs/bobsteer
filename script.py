import os
import json
import shutil
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import quote
import re

# Define paths
base_dir = Path.cwd()
html_dir = base_dir / "html"
covers_dir = base_dir / "covers"
assets_dir = base_dir / "assets"
output_dir = base_dir / "output"
output_html_dir = output_dir / "html"
output_cover_dir = output_dir / "cover"
output_json_path = output_dir / "gameData.json"

# Ensure output directories exist
output_html_dir.mkdir(parents=True, exist_ok=True)
output_cover_dir.mkdir(parents=True, exist_ok=True)

# Helper to remove known tracking/ads
def remove_tracking_and_ads(soup):
    ad_domains = [
        'googletagmanager.com', 'google-analytics.com', 'imasdk.googleapis.com',
        'gamemonetize.com', 'doubleclick.net', 'adsbygoogle', 'sdkloader',
        'adservice.google', 'adsystem', 'adsrvr', 'gamepix.com/sdk',
        'gameplayer.io/sdk', 'nitropay.com', 'adinplay.com', 'gameflare',
        'ad-manager', 'ads.js'
    ]

    suspicious_keywords = [
        'gtag(', 'ga(', 'window.dataLayer', 'adConfig', 'adsbygoogle',
        'gameMonetize', 'SDK_GAME_START', 'AdSDK', 'sdkloader'
    ]

    for script in soup.find_all('script'):
        src = script.get('src', '') or ''
        content = script.string or ''
        if any(domain in src for domain in ad_domains) or any(keyword in content for keyword in suspicious_keywords):
            script.decompose()

    for iframe in soup.find_all('iframe'):
        src = iframe.get('src', '')
        if any(domain in src for domain in ad_domains):
            iframe.decompose()

def slugify(text):
    # Lowercase and replace spaces with hyphens
    text = text.lower().strip().replace(" ", "-")

    # Remove characters not allowed in Windows file names
    text = re.sub(r'[\\/:*?"<>|]', '', text)

    # Replace multiple dashes with single dash
    text = re.sub(r'-{2,}', '-', text)

    return text


# Start JSON data array
game_data = []

# Iterate through HTML files
for html_file in html_dir.glob("*.html"):
    file_number = html_file.stem

    # Skip if asset directory exists for this file
    if (assets_dir / file_number).exists():
        continue

    # Read and parse HTML
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')

    # Extract <title>
    title_tag = soup.find('title')
    if not title_tag or not title_tag.text.strip():
        continue
    title = title_tag.text.strip()
    
    title = title.strip()

    # Strip prefix if present
    prefix = "Unity WebGL Player | "
    if title.startswith(prefix):
        title = title[len(prefix):].strip()
    
    name = slugify(title)
    # name = quote(title.lower().replace(" ", "-").replace("–", "-").replace("_", "-"))

    # Remove tracking and ads
    remove_tracking_and_ads(soup)

    # Save cleaned HTML
    output_html_path = output_html_dir / f"{name}.html"
    with open(output_html_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))

    # Copy image from covers directory
    source_cover = covers_dir / f"{file_number}.png"
    target_cover = output_cover_dir / f"{name}.png"
    if source_cover.exists():
        shutil.copyfile(source_cover, target_cover)
    else:
        continue  # Skip if no corresponding cover image

    # Add entry to gameData.json
    game_data.append({
        "title": title,
        "cover": f"./cover/{name}.png",
        "path": f"./html/{name}.html"
    })

# Save final JSON file
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(game_data, f, indent=4)

print(f"✅ Done. Processed {len(game_data)} games.")
