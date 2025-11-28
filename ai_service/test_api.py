import requests

API_URL = "http://localhost:8000"

# 1. Test Chat
print("💬 Testing Chat...")
response = requests.post(f"{API_URL}/chat", json={"query": "What is FinAdapt?"})
print(response.json())

# 2. Test Cleaner
print("\n🧹 Testing Cleaner...")
response = requests.post(f"{API_URL}/clean", json={"raw_text": "NETFLIX.COM -649"})
print(response.json())