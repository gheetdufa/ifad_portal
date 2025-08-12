#!/usr/bin/env python3
"""Simple S3 deployment script for the IFAD Portal frontend"""

import os
import sys
import mimetypes
import boto3
from botocore.exceptions import ClientError
from pathlib import Path

def upload_file_to_s3(s3_client, file_path, bucket_name, key):
    """Upload a file to S3 with proper content type"""
    try:
        # Determine content type
        content_type, _ = mimetypes.guess_type(file_path)
        if content_type is None:
            content_type = 'application/octet-stream'
        
        # Upload file
        s3_client.upload_file(
            str(file_path),
            bucket_name,
            key,
            ExtraArgs={
                'ContentType': content_type,
                'CacheControl': 'max-age=31536000' if key.startswith('assets/') else 'max-age=0'
            }
        )
        print(f"✓ Uploaded {key}")
        return True
    except Exception as e:
        print(f"✗ Failed to upload {key}: {e}")
        return False

def deploy_to_s3():
    """Deploy the frontend to S3"""
    # Configuration
    bucket_name = "ifad-website-staging-050752652470"
    dist_dir = Path("dist")
    
    if not dist_dir.exists():
        print("❌ dist directory not found. Please run 'npm run build:staging' first.")
        sys.exit(1)
    
    # Initialize S3 client
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('AWS_REGION', 'us-east-1')
        )
    except Exception as e:
        print(f"❌ Failed to initialize AWS client: {e}")
        sys.exit(1)
    
    print(f"🚀 Deploying to S3 bucket: {bucket_name}")
    
    # Upload all files
    uploaded_count = 0
    failed_count = 0
    
    for file_path in dist_dir.rglob('*'):
        if file_path.is_file():
            # Calculate S3 key (relative path from dist)
            key = str(file_path.relative_to(dist_dir)).replace('\\', '/')
            
            if upload_file_to_s3(s3_client, file_path, bucket_name, key):
                uploaded_count += 1
            else:
                failed_count += 1
    
    print(f"\n📊 Deployment Summary:")
    print(f"✓ Successfully uploaded: {uploaded_count} files")
    if failed_count > 0:
        print(f"✗ Failed uploads: {failed_count} files")
    
    if failed_count == 0:
        print(f"\n🎉 Deployment successful!")
        print(f"Website URL: https://d1zxum7vyu9fyt.cloudfront.net")
        print(f"Note: CloudFront may take a few minutes to update.")
    else:
        print(f"\n⚠️  Deployment completed with errors.")

if __name__ == "__main__":
    deploy_to_s3()