'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Activity, Heart, Dumbbell, Timer, Flame, ChevronRight, Shield, Database, Play, Pause, WatchIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const mockSleepData = [
  { time: '22:00', light: 30, deep: 10, rem: 5 },
  { time: '23:00', light: 45, deep: 20, rem: 15 },
  { time: '00:00', light: 60, deep: 40, rem: 25 },
  { time: '01:00', light: 50, deep: 45, rem: 30 },
  { time: '02:00', light: 40, deep: 50, rem: 35 },
  { time: '03:00', light: 30, deep: 45, rem: 40 },
  { time: '04:00', light: 20, deep: 30, rem: 35 },
  { time: '05:00', light: 10, deep: 20, rem: 25 },
];

const mockWorkoutData = [
  { time: 'Mon', calories: 300, heartRate: 75 },
  { time: 'Tue', calories: 450, heartRate: 85 },
  { time: 'Wed', calories: 200, heartRate: 70 },
  { time: 'Thu', calories: 550, heartRate: 90 },
  { time: 'Fri', calories: 400, heartRate: 80 },
  { time: 'Sat', calories: 600, heartRate: 95 },
  { time: 'Sun', calories: 350, heartRate: 78 },
];

const mockHeartRateData = Array.from({ length: 60 }, (_, i) => ({
  time: format(new Date(2024, 0, 1, 10, i), 'HH:mm'),
  heartRate: Math.floor(140 + Math.sin(i / 5) * 20 + Math.random() * 10),
  zone: 'cardio'
}));

export default function Dashboard() {
  const [currentDay] = useState(1);
  const [currentExercise] = useState(1);
  const totalExercises = 5;
  const [isPlaying, setIsPlaying] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Fitness Coach. How can I help you with your workout today?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Based on your current exercise plan and progress, I recommend focusing on proper form for the abdominal exercises. Remember to breathe steadily and engage your core throughout the movement.',
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Workout Plan</h1>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((day) => (
                <button
                  key={day}
                  className={`px-4 py-2 rounded-lg ${
                    day === currentDay
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Day {day} {day === currentDay && '🔥'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => {
                console.log('Exporting to data vaults...');
              }}
            >
              <Database className="h-4 w-4" />
              Export to Encrypted Data Vaults
            </Button>
            <ConnectButton />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Exercise Area */}
          <div className="col-span-8">
            <Card className="bg-gray-50 border-none p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Exercise {currentExercise}/{totalExercises}</h2>
                  <p className="text-gray-600">Abdominal muscles</p>
                </div>
                <Button variant="outline" className="rounded-full hover:bg-white/50">
                  <Heart className={`h-4 w-4 text-red-500 ${isPlaying ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {mockHeartRateData[mockHeartRateData.length - 1].heartRate} BPM
                    </div>
                    <div className="text-sm text-gray-500">Current Heart Rate</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`gap-2 ${isPlaying ? 'bg-red-50 text-red-600 hover:bg-red-100' : ''}`}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Start'} Exercise
                  </Button>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHeartRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="time"
                        tickFormatter={(time) => time.split(':')[1]}
                        stroke="#888"
                        fontSize={12}
                      />
                      <YAxis
                        domain={[80, 180]}
                        ticks={[80, 100, 120, 140, 160, 180]}
                        stroke="#888"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{ background: 'white', border: '1px solid #f0f0f0' }}
                        labelStyle={{ color: '#888' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Dumbbell, label: 'Stretching', value: 'EXERCISE' },
                  { icon: Activity, label: '2', value: 'DIFFICULT' },
                  { icon: Timer, label: '45sec', value: 'TOTAL TIME' },
                  { icon: Flame, label: '30sec', value: 'REST TIME' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                    <item.icon className="h-5 w-5 mb-2" />
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            <Card className="p-6 border-none">
              <h3 className="font-medium mb-4">EXERCISES</h3>
              <div className="space-y-4">
                {[
                  { name: 'Abdominal muscles', duration: '30 mins', calories: '40kcal', status: 'current' },
                  { name: 'Jumping on ball', duration: '15 mins', calories: '90kcal', status: 'next' },
                  { name: 'With dumbbells', duration: '30 mins', calories: '60kcal', status: 'next' },
                  { name: 'Jumping', duration: '10 mins', calories: '100kcal', status: 'next' },
                ].map((exercise, i) => (
                  <div
                    key={i}
                    className={`flex items-center p-4 rounded-xl ${
                      exercise.status === 'current' ? 'bg-gray-100' : 'bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg mr-4" />
                    <div className="flex-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="text-sm text-gray-500">
                        {exercise.duration} • {exercise.calories}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      exercise.status === 'current' ? 'bg-black text-white' : 'bg-gray-200'
                    }`}>
                      {exercise.status === 'current' ? '1' : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Connected Device Status */}
            <Card className="p-6 border-none">
              <div className="flex items-center gap-2 mb-4">
                <WatchIcon className="h-5 w-5" />
                <h3 className="font-medium">Connected Device</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Whoop 4.0</span>
                  <span className="text-xs text-green-500">Connected</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last synced: 5 minutes ago
                </div>
              </div>
            </Card>

            <div className="text-xs text-gray-500 text-right flex items-center justify-end gap-1">
              <Shield className="h-3 w-3" />
              Powered by Gateway Network
            </div>
          </div>
        </div>

        {/* AI Coach Section */}
        <Card className="p-6 border-none bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5" />
            <h2 className="text-xl font-semibold">AI Fitness Coach</h2>
          </div>
          
          <ScrollArea className="h-[300px] mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Ask your AI coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim()} 
              className="bg-black text-white hover:bg-gray-800"
            >
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}