import type { Story } from '../types/story'

export const stories: Story[] = [
  {
    id: 'red-umbrella',
    title: '小兔子的红雨伞',
    level: 'L1',
    ageRange: '6 岁左右',
    theme: '分享与帮助',
    summary: '下雨天，小兔子用一把红雨伞帮助了没有伞的朋友。',
    coverEmoji: '☂️',
    estimatedMinutes: 5,
    keywords: ['雨', '伞', '红', '朋友'],
    pages: [
      {
        id: 'p1',
        text: '下雨了，小兔子撑着一把红雨伞，慢慢走在小路上。',
        keywords: ['雨', '伞'],
      },
      {
        id: 'p2',
        text: '小松鼠站在树下，尾巴湿湿的。它没有带伞。',
        keywords: ['树', '伞'],
      },
      {
        id: 'p3',
        text: '小兔子说：“我们一起走吧，红雨伞很大。”',
        keywords: ['红', '一起'],
      },
      {
        id: 'p4',
        text: '两个朋友躲在伞下，雨点落在伞面上，像在唱歌。',
        keywords: ['朋友', '雨点'],
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'word',
        prompt: '“红雨伞”的“伞”是哪一个？',
        options: ['伞', '云', '车'],
        answer: '伞',
        explanation: '伞可以在下雨时帮我们挡雨。',
      },
      {
        id: 'q2',
        type: 'comprehension',
        prompt: '小兔子帮助了谁？',
        options: ['小松鼠', '小猫', '小鸟'],
        answer: '小松鼠',
        explanation: '故事里小松鼠没有带伞，小兔子和它一起走。',
      },
      {
        id: 'q3',
        type: 'comprehension',
        prompt: '这个故事主要告诉我们什么？',
        options: ['要帮助朋友', '要跑得很快', '要把伞藏起来'],
        answer: '要帮助朋友',
        explanation: '小兔子把伞分享给朋友，这是一种帮助。',
      },
    ],
  },
  {
    id: 'glowing-stone',
    title: '会发光的石头',
    level: 'L1',
    ageRange: '6 岁左右',
    theme: '好奇心',
    summary: '小鹿在草地上发现一颗会发光的小石头，并学会认真观察。',
    coverEmoji: '✨',
    estimatedMinutes: 5,
    keywords: ['光', '石', '找', '亮'],
    pages: [
      {
        id: 'p1',
        text: '傍晚，小鹿在草地上看到一点亮光。',
        keywords: ['光', '亮'],
      },
      {
        id: 'p2',
        text: '它低头一看，原来是一颗小石头在月光下闪闪发亮。',
        keywords: ['石', '月光'],
      },
      {
        id: 'p3',
        text: '小鹿没有急着拿走它，而是叫朋友们一起来看。',
        keywords: ['朋友', '看'],
      },
      {
        id: 'p4',
        text: '大家发现，认真观察就能找到很多有趣的小秘密。',
        keywords: ['找', '观察'],
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'word',
        prompt: '故事里会发亮的是哪一个？',
        options: ['石头', '鞋子', '帽子'],
        answer: '石头',
        explanation: '小鹿看到的是一颗在月光下发亮的小石头。',
      },
      {
        id: 'q2',
        type: 'comprehension',
        prompt: '小鹿在哪里发现亮光？',
        options: ['草地上', '河水里', '屋顶上'],
        answer: '草地上',
        explanation: '故事开头说小鹿在草地上看到亮光。',
      },
      {
        id: 'q3',
        type: 'comprehension',
        prompt: '大家最后明白了什么？',
        options: ['认真观察会发现秘密', '石头都会唱歌', '晚上不能出门'],
        answer: '认真观察会发现秘密',
        explanation: '故事结尾说认真观察能找到有趣的小秘密。',
      },
    ],
  },
  {
    id: 'bear-brush-teeth',
    title: '小熊不想刷牙',
    level: 'L1',
    ageRange: '6 岁左右',
    theme: '生活习惯',
    summary: '小熊一开始不想刷牙，后来知道干净的牙齿很重要。',
    coverEmoji: '🪥',
    estimatedMinutes: 5,
    keywords: ['牙', '刷', '水', '干净'],
    pages: [
      {
        id: 'p1',
        text: '早上，小熊揉揉眼睛，说：“我不想刷牙。”',
        keywords: ['牙', '刷'],
      },
      {
        id: 'p2',
        text: '妈妈拿来牙刷和一杯清水，笑着说：“牙齿也要洗澡呀。”',
        keywords: ['水', '牙刷'],
      },
      {
        id: 'p3',
        text: '小熊刷呀刷，嘴巴里有了清清爽爽的味道。',
        keywords: ['刷', '清爽'],
      },
      {
        id: 'p4',
        text: '它照照镜子，说：“干净的牙齿真好看！”',
        keywords: ['干净', '牙齿'],
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'word',
        prompt: '“刷牙”的“牙”指的是哪里？',
        options: ['牙齿', '耳朵', '尾巴'],
        answer: '牙齿',
        explanation: '刷牙就是清洁牙齿。',
      },
      {
        id: 'q2',
        type: 'comprehension',
        prompt: '妈妈拿来了什么？',
        options: ['牙刷和清水', '雨伞和帽子', '小车和石头'],
        answer: '牙刷和清水',
        explanation: '故事里妈妈拿来牙刷和一杯清水。',
      },
      {
        id: 'q3',
        type: 'judge',
        prompt: '小熊最后觉得干净的牙齿很好看。',
        options: ['对', '错'],
        answer: '对',
        explanation: '小熊照镜子后说干净的牙齿真好看。',
      },
    ],
  },
  {
    id: 'cloud-postman',
    title: '云朵邮递员',
    level: 'L2',
    ageRange: '7 岁左右',
    theme: '想象力',
    summary: '一朵小云把森林朋友们的信送到天空和远方。',
    coverEmoji: '☁️',
    estimatedMinutes: 7,
    keywords: ['云', '信', '送', '天空'],
    pages: [
      {
        id: 'p1',
        text: '小云朵住在蓝蓝的天空里，它最喜欢听森林里的声音。',
        keywords: ['云', '天空'],
      },
      {
        id: 'p2',
        text: '一天，小鸟写了一封信，想送给远山那边的朋友。',
        keywords: ['信', '朋友'],
      },
      {
        id: 'p3',
        text: '小云朵轻轻飘下来，说：“我可以帮你送信。”',
        keywords: ['送', '飘'],
      },
      {
        id: 'p4',
        text: '风儿推着小云朵，越过树林，越过小河，把信送到了远方。',
        keywords: ['风', '远方'],
      },
      {
        id: 'p5',
        text: '小鸟收到回信后高兴地说：“谢谢你，云朵邮递员！”',
        keywords: ['回信', '谢谢'],
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'word',
        prompt: '“送信”的“信”是哪一个？',
        options: ['信', '雨', '牙'],
        answer: '信',
        explanation: '信可以写给远方的朋友。',
      },
      {
        id: 'q2',
        type: 'comprehension',
        prompt: '谁帮助小鸟送信？',
        options: ['小云朵', '小熊', '小兔子'],
        answer: '小云朵',
        explanation: '小云朵说它可以帮小鸟送信。',
      },
      {
        id: 'q3',
        type: 'comprehension',
        prompt: '小云朵把信送到了哪里？',
        options: ['远方', '牙刷旁边', '红雨伞下面'],
        answer: '远方',
        explanation: '故事里小云朵把信送到了远方。',
      },
    ],
  },
  {
    id: 'slow-forest-bus',
    title: '森林里的慢慢车',
    level: 'L2',
    ageRange: '7 岁左右',
    theme: '耐心与合作',
    summary: '森林里的慢慢车虽然开得慢，却把每位朋友安全送到家。',
    coverEmoji: '🚌',
    estimatedMinutes: 7,
    keywords: ['车', '慢', '等', '一起'],
    pages: [
      {
        id: 'p1',
        text: '森林里有一辆慢慢车，它开得不快，却很稳。',
        keywords: ['车', '慢'],
      },
      {
        id: 'p2',
        text: '小猴着急地说：“能不能快一点？我想早点到。”',
        keywords: ['快', '着急'],
      },
      {
        id: 'p3',
        text: '司机河马说：“我们要等小刺猬坐稳，再一起出发。”',
        keywords: ['等', '一起'],
      },
      {
        id: 'p4',
        text: '慢慢车一路稳稳地开，大家看见了花，也听见了鸟叫。',
        keywords: ['稳', '花'],
      },
      {
        id: 'p5',
        text: '到站时，小猴笑了：“慢一点，也能看到更多美好的东西。”',
        keywords: ['到站', '美好'],
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'word',
        prompt: '“慢慢车”的“车”是哪一个？',
        options: ['车', '云', '伞'],
        answer: '车',
        explanation: '车可以载大家去不同的地方。',
      },
      {
        id: 'q2',
        type: 'comprehension',
        prompt: '司机河马为什么要等一等？',
        options: ['要等小刺猬坐稳', '要找发光石头', '要刷牙'],
        answer: '要等小刺猬坐稳',
        explanation: '河马司机想让大家安全出发。',
      },
      {
        id: 'q3',
        type: 'comprehension',
        prompt: '小猴最后明白了什么？',
        options: ['慢一点也能看到美好', '所有车都不能坐', '朋友不需要等待'],
        answer: '慢一点也能看到美好',
        explanation: '小猴发现慢慢走也能看到花和听见鸟叫。',
      },
    ],
  },
]

export function getStoryById(storyId: string | null) {
  if (!storyId) return null
  return stories.find((story) => story.id === storyId) ?? null
}

export function getNextUnfinishedStoryId(completedStoryIds: string[]) {
  return stories.find((story) => !completedStoryIds.includes(story.id))?.id ?? stories[0]?.id ?? null
}
