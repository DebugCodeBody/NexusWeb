from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes



import json
import time


def aes_encrypt(key, data):
    key = bytes.fromhex(key) if isinstance(key, str) else key
    iv = iv
    
    data['uuid'] = int(time.time() * 1000)
    data = json.dumps(data)
    data = data.encode('utf-8') if isinstance(data, str) else data

    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_data = cipher.encrypt(pad(data, AES.block_size))
    
    return encrypted_data.hex()

def aes_decrypt(key, encrypted_data):
    
    key = bytes.fromhex(key) if isinstance(key, str) else key
    iv = key
    encrypted_data = bytes.fromhex(encrypted_data) if isinstance(encrypted_data, str) else encrypted_data

    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
    
    return decrypted_data.decode('utf-8')


