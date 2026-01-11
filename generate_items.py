import os
import json

BASE_DIR = r"c:\Users\sumnk\Downloads\FF_SPINSX\public\assets\images\images"
OUTPUT_FILE = r"c:\Users\sumnk\Downloads\FF_SPINSX\public\assets\extraItems.json"

def scan_directory(category, item_type):
    items = []
    category_dir = os.path.join(BASE_DIR, category)
    
    if not os.path.exists(category_dir):
        print(f"Directory not found: {category_dir}")
        return items

    for rarity in os.listdir(category_dir):
        rarity_dir = os.path.join(category_dir, rarity)
        if os.path.isdir(rarity_dir):
            for filename in os.listdir(rarity_dir):
                if filename.endswith(".png"):
                    item_id = filename.replace(".png", "")
                    
                    # Construct the web-accessible path
                    # Note: The app seems to use /assets/...
                    image_path = f"/assets/images/images/{category}/{rarity}/{filename}"
                    
                    item = {
                        "itemID": int(item_id) if item_id.isdigit() else item_id,
                        "name": f"{item_type} {item_id}", # Generic name
                        "description": f"A {rarity} {item_type}",
                        "Rare": rarity,
                        "itemType": item_type,
                        "image": image_path,
                        "isUnique": True
                    }
                    items.append(item)
    return items

banners = scan_directory("BANNER", "BANNER")
avatars = scan_directory("AVATARS", "AVATAR")

all_items = banners + avatars

print(f"Found {len(banners)} banners and {len(avatars)} avatars.")

with open(OUTPUT_FILE, "w") as f:
    json.dump(all_items, f, indent=4)

print(f"Saved to {OUTPUT_FILE}")
