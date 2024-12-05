from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from volcenginesdkarkruntime import Ark

@csrf_exempt
def get_name(request):
    client = Ark(base_url="https://ark.cn-beijing.volces.com/api/v3",api_key="c4d9ab16-95fb-497e-857c-7cad196ccfea")
    model = "ep-20240623090442-d8b85"
    if request.method == 'POST':
        body = json.loads(request.body)
        name = body.get('name')

        # 调用豆包 API，假设为 POST 请求，并支持流式响应
        def stream():
            response = client.chat.completions.create( model="ep-20240623090442-d8b85",messages = [{"role": "system", "content": "你是一个起名师你要为外国人起5个好听的中文名字。最好有名有姓，且简单阐述寓意"},{"role": "user", "content": f"{name}"},],stream=True)
            print(name)
            
            for line in response:
                if not line.choices:
                    continue
                print(line.choices[0].delta.content,end = "")
                yield line.choices[0].delta.content
        return StreamingHttpResponse(stream(), content_type='text/event-stream')
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def getDoubaoResult(prompt,model = "ep-20240802133823-9xhm7",ifStream = False):
    rawStream = client.chat.completions.create(
    model=model,
    messages = [
        {"role": "system", "content": "你是一个起名师你要为外国人起好听的名字。"},
        {"role": "user", "content": prompt},
    ],
    stream=True)
    if ifStream:
        return completion.choices[0].message.content
    else: 
        stream = []
        for chunk in stream:
            if not chunk.choices:
                continue
            stream.append(chunk.choices[0].delta.content)
        return stream