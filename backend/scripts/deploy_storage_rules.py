"""
Script để deploy Storage Rules lên Firebase
Chạy script này để cập nhật rules cho Firebase Storage
"""
import subprocess
import os

def deploy_storage_rules():
    """Deploy storage rules using Firebase CLI"""
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(backend_dir)
    
    print("Deploying Firebase Storage Rules...")
    print(f"Working directory: {os.getcwd()}")
    
    try:
        # Deploy storage rules only
        result = subprocess.run(
            ['firebase', 'deploy', '--only', 'storage'],
            capture_output=True,
            text=True,
            check=True
        )
        
        print("✓ Storage rules deployed successfully!")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        print("✗ Failed to deploy storage rules")
        print(f"Error: {e.stderr}")
        print("\nMake sure you have:")
        print("1. Installed Firebase CLI: npm install -g firebase-tools")
        print("2. Logged in: firebase login")
        print("3. Initialized project: firebase init")
        
    except FileNotFoundError:
        print("✗ Firebase CLI not found!")
        print("\nPlease install Firebase CLI:")
        print("  npm install -g firebase-tools")
        print("\nThen login:")
        print("  firebase login")

if __name__ == '__main__':
    deploy_storage_rules()
