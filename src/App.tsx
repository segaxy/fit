import { useState } from 'react'
import { Dumbbell, Calendar, CheckSquare, BarChart2 } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">健身计划管理</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {activeTab === 'daily' && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" /> 今日计划
              </h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-500">暂无今日计划，点击下方按钮添加。</p>
              </div>
            </section>
          )}
          {activeTab === 'todo' && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="w-5 h-5" /> 待办事宜
              </h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-500">所有任务已完成！</p>
              </div>
            </section>
          )}
          {activeTab === 'analysis' && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> 统计分析
              </h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-500">本周健身时长：0 分钟</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <nav className="bg-white border-t border-gray-200 flex justify-around p-2">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center p-2 ${activeTab === 'daily' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Dumbbell className="w-6 h-6" />
          <span className="text-xs">计划</span>
        </button>
        <button 
          onClick={() => setActiveTab('todo')}
          className={`flex flex-col items-center p-2 ${activeTab === 'todo' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <CheckSquare className="w-6 h-6" />
          <span className="text-xs">待办</span>
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`flex flex-col items-center p-2 ${activeTab === 'analysis' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs">分析</span>
        </button>
      </nav>
    </div>
  )
}

export default App
