import os
import re

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.css', '.tsx', '.ts', '.html')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                matches = re.findall(r'url\([^)]+\)', content)
                if matches:
                    print(f"{p}: {matches}")
