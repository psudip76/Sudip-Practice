
import React, { useState, useCallback } from 'react';
import { Trash2, Plus, Pipette, Wand2, Download, Layers, Eraser } from 'lucide-react';
import Editor from './components/Editor';
import { BrickData, BrickType } from './types';
import { COLORS, BRICK_METADATA } from './constants';
import { generateLegoCreation } from './services/gemini';

const App: React.FC = () => {
  const [bricks, setBricks] = useState<BrickData[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedType, setSelectedType] = useState<BrickType>('2x2');
  const [tool, setTool] = useState<'add' | 'remove' | 'paint'>('add');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAddBrick = useCallback((newBrick: Omit<BrickData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setBricks(prev => [...prev, { ...newBrick, id }]);
  }, []);

  const handleRemoveBrick = useCallback((id: string) => {
    setBricks(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleUpdateBrick = useCallback((id: string, updates: Partial<BrickData>) => {
    setBricks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const clearAll = () => {
    if (confirm("Clear your masterpiece?")) setBricks([]);
  };

  const handleAiBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    try {
      const generated = await generateLegoCreation(aiPrompt);
      const withIds = generated.map(b => ({
        ...b,
        id: Math.random().toString(36).substr(2, 9)
      })) as BrickData[];
      setBricks(prev => [...prev, ...withIds]);
      setAiPrompt('');
    } catch (error) {
      alert("Failed to build with AI. Try again!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportProject = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bricks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "brick_masterpiece.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-900 bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BrickBuilder <span className="text-red-500 font-black">3D</span></h1>
        </div>

        <form onSubmit={handleAiBuild} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI to build something... (e.g. 'a tree')" 
              className="w-full pl-4 pr-12 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-red-400 text-sm"
              disabled={isAiLoading}
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors disabled:opacity-50"
              disabled={isAiLoading}
            >
              <Wand2 className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button 
            onClick={exportProject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tools</h2>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTool('add')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${tool === 'add' ? 'bg-red-100 text-red-600 ring-2 ring-red-400' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">ADD</span>
              </button>
              <button 
                onClick={() => setTool('paint')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${tool === 'paint' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <Pipette className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">PAINT</span>
              </button>
              <button 
                onClick={() => setTool('remove')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${tool === 'remove' ? 'bg-slate-800 text-white ring-2 ring-slate-900' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <Eraser className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">ERASE</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-slate-100 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Shapes</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(BRICK_METADATA) as BrickType[]).map((type) => (
                <button 
                  key={type}
                  onClick={() => { setSelectedType(type); setTool('add'); }}
                  className={`relative p-4 bg-slate-50 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 ${selectedType === type ? 'border-red-400 bg-white shadow-sm' : 'border-transparent'}`}
                >
                   <div className="text-xs font-bold text-slate-800">{type}</div>
                   <div className="flex gap-0.5">
                     {Array.from({ length: BRICK_METADATA[type].width }).map((_, i) => (
                       <div key={i} className="w-2 h-2 rounded-full bg-slate-300" />
                     ))}
                   </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Colors</h2>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-125 ${selectedColor === color ? 'border-slate-800 ring-2 ring-slate-200' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Editor Main Area */}
        <main className="flex-1 relative">
          <Editor 
            bricks={bricks}
            onAddBrick={handleAddBrick}
            onRemoveBrick={handleRemoveBrick}
            onUpdateBrick={handleUpdateBrick}
            selectedColor={selectedColor}
            selectedType={selectedType}
            tool={tool}
          />
          
          {/* Legend Overlay */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none hidden sm:block">
             <h3 className="text-xs font-black text-slate-500 mb-2 uppercase tracking-tight">Stats</h3>
             <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-8 text-sm">
                  <span className="text-slate-400">Total Bricks</span>
                  <span className="font-mono font-bold text-slate-800">{bricks.length}</span>
                </div>
                <div className="flex justify-between gap-8 text-sm">
                  <span className="text-slate-400">Active Tool</span>
                  <span className="font-bold text-red-500 uppercase text-xs">{tool}</span>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
