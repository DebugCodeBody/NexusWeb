import requests





Authorization = "6bb61e3b7bce0931da574d19d1d82c88-e217f33bcdec2d2e829b035d4547cd97-65d24e754bd9530508177829bf96b62b"
encryptKey = "6bb61e3b7bce0931"
decryptKey = "65d24e754bd95305"
headerAuthorization = "Bearer " + Authorization





Url = "https://api.jameswoof.com/login/app/twitter_url?sign="


headers = {
    'Authorization': headerAuthorization,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    "Referer": "https://app.jameswoof.com/"
    
}

# 发送带有自定义请求头的GET请求
response = requests.get('https://api.example.com/data', headers=headers)