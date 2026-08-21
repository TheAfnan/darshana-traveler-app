"""
Hugging Face Dataset Uploader for Darshana AI Tourism Knowledge Graph
Uses huggingface_hub HfApi (Point 5 workflow)
"""
import os
import sys

def upload_dataset(hf_token=None, repo_id=None):
    token = hf_token or os.environ.get("HF_TOKEN")
    repo = repo_id or os.environ.get("HF_DATASET_REPO", "TheAfnan/darshana-cultural-heritage-dataset")
    
    if not token:
        print("❌ Error: HF_TOKEN not found in environment. Please provide your Hugging Face write token.")
        print("Usage: python scripts/push_to_huggingface.py <YOUR_HF_TOKEN> [optional_repo_id]")
        sys.exit(1)

    try:
        from huggingface_hub import HfApi
    except ImportError:
        print("📦 Installing huggingface_hub...")
        os.system(f"{sys.executable} -m pip install huggingface_hub")
        from huggingface_hub import HfApi

    api = HfApi(token=token)

    # 1. Create dataset repo if it doesn't exist
    try:
        api.create_repo(repo_id=repo, repo_type="dataset", exist_ok=True, private=False)
        print(f"✅ Repository ready: https://huggingface.co/datasets/{repo}")
    except Exception as e:
        print(f"ℹ️ Repo info: {e}")

    # 2. Upload JSONL dataset
    dataset_file = os.path.join(os.path.dirname(__file__), "..", "data", "darshana_cultural_dataset.jsonl")
    if os.path.exists(dataset_file):
        print(f"🚀 Uploading {dataset_file} to Hugging Face...")
        api.upload_file(
            path_or_fileobj=dataset_file,
            path_in_repo="darshana_cultural_dataset.jsonl",
            repo_id=repo,
            repo_type="dataset"
        )
        print(f"🎉 Dataset successfully uploaded!")
        print(f"🔗 View your live dataset at: https://huggingface.co/datasets/{repo}")
    else:
        print(f"❌ Error: {dataset_file} not found!")

if __name__ == "__main__":
    cli_token = sys.argv[1] if len(sys.argv) > 1 else None
    cli_repo = sys.argv[2] if len(sys.argv) > 2 else None
    upload_dataset(cli_token, cli_repo)
