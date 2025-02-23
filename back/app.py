from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
import json
import uuid

app = Flask(__name__)
CORS(app)  # 允许跨域请求，生产环境需更严格配置

# 创建日志目录（如果不存在的话）
if not os.path.exists('logs'):
    os.makedirs('logs')

@app.route('/api/logs', methods=['POST'])
def receive_logs():
    print("******")
    data = request.get_json()
    if not data or 'logs' not in data:
        return jsonify({'error': 'Invalid data'}), 400

    logs = data['logs']
    print(f"receive logs:{logs}")
    
    # 遍历日志，筛选 action 为 "questionaire" 的条目
    for log in logs:
        if log.get('action') == 'questionaire':
            details = log.get('details', {})
            userId = details.get('userId')
            ruleId = details.get('ruleId')
            if not userId or not ruleId:
                print(f"日志中缺少 userId 或 ruleId: {log}")
                continue
            # 构建文件路径
            file_dir = f'mpResults/P{userId}'
            os.makedirs(file_dir, exist_ok=True)
            file_path = os.path.join(file_dir, f'rule_{ruleId}.json')
            # 将 details 写入文件
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(logs, f, ensure_ascii=False, indent=4)
                print(f"已将 logs 保存到 {file_path}")
            except Exception as e:
                print(f"无法保存规则 {ruleId} 为用户 {userId}: {e}")

    return jsonify({'message': 'Logs processed'}), 200


@app.route('/api/logs', methods=['GET'])
def get_logs():
    # 获取 logs 目录下的所有日志文件
    log_files = os.listdir('logs')
    log_files = [file for file in log_files if file.endswith('.json')]
    
    logs = []
    for log_file in log_files:
        with open(os.path.join('logs', log_file), 'r') as f:
            logs.append(json.load(f))
    
    return jsonify({'logs': logs}), 200


if __name__ == '__main__':
    app.run(host = "0.0.0.0", port=22235, debug=True)
