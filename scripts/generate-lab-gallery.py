import os
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
media_dir = root / 'images' / 'lab'
output_file = media_dir / 'gallery-media.js'

allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.mp4', '.webm', '.mov', '.m4v'}
video_extensions = {'.mp4', '.webm', '.mov', '.m4v'}

entries = []
for file_path in sorted(media_dir.iterdir()):
    if not file_path.is_file():
        continue
    ext = file_path.suffix.lower()
    if ext not in allowed_extensions:
        continue

    media_type = 'video' if ext in video_extensions else 'image'
    title = re.sub(r'[_-]+', ' ', file_path.stem).strip()
    title = re.sub(r'\s+', ' ', title)
    src = '../images/lab/' + file_path.name
    entries.append({
        'src': src,
        'type': media_type,
        'alt': f'{title} from the home lab gallery',
    })

content = 'window.labGalleryMedia = ' + str(entries).replace("'", '"') + ';\n'
output_file.write_text(content, encoding='utf-8')
print(f'Wrote {len(entries)} gallery item(s) to {output_file.relative_to(root)}')
