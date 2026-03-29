import { useState, useEffect } from 'react'
import { Dumbbell, Calendar, CheckSquare, BarChart2, Plus, X } from 'lucide-react'

interface Item {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('daily')
  const [items, setItems] = useState<Item[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', type: 'weekly', time: '08:00' })

  const fetchData = async () => {
    try {
      let endpoint = '/api/plans'
      if (activeTab === 'todo') endpoint = '/api/todos'
      if (activeTab === 'analysis') return;

      const response = await fetch(endpoint)
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let endpoint = '/api/plans'
      let body: any = { 
        title: formData.title, 
        description: formData.description,
        reminder_time: formData.time 
      }

      if (activeTab === 'daily') {
        body.type = 'weekly'
        body.frequency_data = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      } else if (activeTab === 'todo') {
        endpoint = '/api/todos'
        body.due_date = new Date().toISOString().split('T')[0]
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({ title: '', description: '', type: 'weekly', time: '08:00' })
        fetchData()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">健身计划管理</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {activeTab === 'daily' && <><Calendar className="w-5 h-5" /> 今日计划</>}
              {activeTab === 'todo' && <><CheckSquare className="w-5 h-5" /> 待办事宜</>}
              {activeTab === 'analysis' && <><BarChart2 className="w-5 h-5" /> 统计分析</>}
            </h2>
            {activeTab !== 'analysis' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {activeTab !== 'analysis' ? (
            items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500 mb-4">暂无数据，点击上方“+”号添加。</p>
              </div>
            )
          ) : (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500">本周健身时长：0 分钟</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">添加新项目</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="例如：晨跑 5km"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="可选补充说明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">提醒时间</label>
                <input 
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
              >
                保存
              </button>
            </form>
          </div>
        </div>
      )}

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
