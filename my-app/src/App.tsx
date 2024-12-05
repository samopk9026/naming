import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
function App() {
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading] = useState<boolean>(false);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setResponse(""); // 当名字改变时，清空之前的结论
  };

  const handleSubmit = async () => {
    setResponse("");
    try {
      const res = await fetch("http://localhost:8000/api/get_name/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      // 处理流式数据
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunkValue = decoder.decode(value);
            setResponse((prev) => prev + chunkValue);
          }
        }
      } else {
        console.error("Response body is null");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="relative hidden flex-col items-start gap-8 md:flex">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="请输入名字"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  {isLoading ? "处理中..." : "提交"}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <div className="prose prose-lg orange-300 mt-8 animate-fade-in">
              {response ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              ) : (
                isLoading && <p>加载中...</p>
              )}
            </div>
            <div className="flex-1" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
