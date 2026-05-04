export const interactiveStory = {
  id: 'bear-brush-teeth-interactive',
  title: '小熊不想刷牙',
  badge: '护牙小卫士',
  scenes: [
    {
      id: 'emotion',
      title: '小熊不想刷牙',
      goal: '理解“不想”',
      text: '小熊说：“我不想刷牙。”',
      hint: '看看小熊的表情，它现在愿意刷牙吗？',
      type: 'choice',
      correctAnswer: '不想',
      choices: ['想', '不想'],
      reward: { stars: 1, item: '👀 观察小能手' }
    },
    {
      id: 'objects',
      title: '牙刷和清水来了',
      goal: '认识牙刷和水',
      text: '妈妈拿来牙刷和一杯清水。',
      hint: '点一点牙刷和水杯，听听它们叫什么。',
      type: 'tapObjects',
      targets: [
        { id: 'toothbrush', label: '牙刷', speech: '牙刷' },
        { id: 'water', label: '水', speech: '清水' }
      ],
      reward: { stars: 1, item: '🪥 找到牙刷' }
    },
    {
      id: 'brush',
      title: '帮小熊刷牙',
      goal: '理解“刷”的动作',
      text: '小熊刷呀刷，牙齿变干净了。',
      hint: '点牙刷，帮小熊刷三下。',
      type: 'repeatTap',
      requiredCount: 3,
      feedback: ['再刷一刷。', '快干净啦。', '太棒了！牙齿变干净啦！'],
      reward: { stars: 2, item: '🫧 干净泡泡' }
    },
    {
      id: 'result',
      title: '牙齿亮晶晶',
      goal: '理解“干净”的结果',
      text: '小熊说：“干净的牙齿真好看！”',
      hint: '点一点牙齿，让它亮起来。',
      type: 'tapFinish',
      reward: { stars: 1, item: '🏅 护牙小卫士' }
    }
  ]
};
