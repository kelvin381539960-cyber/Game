import { interactiveStory } from './story-data.js';

const STORAGE_KEY = 'child-reading-interactive-v1';
const canSpeak = 'speechSynthesis' in window;

const state = {
  sceneIndex: 0,
  completedScenes: new Set(),
  answers: {},
  foundTargets: new Set(),
  brushCount: 0,
  isDraggingBrush: false,
  brushHitCooldown: false,
  resultSparkled: false,
  stars: 0,
  rewards: [],
  progress: { completed: false, bestStars: 0 },
  isSpeaking: false,
  isPaused: false,
  activeWord: '',
  lastAudio: { text: '', title: '' },
};

const $ = (id) => document.getElementById(id);
const currentScene = () => interactiveStory.scenes[state.sceneIndex];

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state.progress = {
      completed: Boolean(saved.completed),
      bestStars: Number(saved.bestStars || 0),
    };
  } catch {
    state.progress = { completed: false, bestStars: 0 };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch {
    // 页面仍可用，本地进度保存失败时忽略。
  }
}

function resetRuntime() {
  state.sceneIndex = 0;
  state.completedScenes = new Set();
  state.answers = {};
  state.foundTargets = new Set();
  state.brushCount = 0;
  state.isDraggingBrush = false;
  state.brushHitCooldown = false;
  state.resultSparkled = false;
  state.stars = 0;
  state.rewards = [];
  state.activeWord = '';
}

function runSelfTests() {
  const failures = [];
  if (!interactiveStory.id || !interactiveStory.title) failures.push('互动故事缺少 id/title');
  if (!Array.isArray(interactiveStory.scenes) || interactiveStory.scenes.length !== 4) failures.push('互动故事必须有 4 个场景');

  interactiveStory.scenes.forEach((scene) => {
    if (!scene.id || !scene.text || !scene.type) failures.push(`场景字段不完整：${scene.id || 'unknown'}`);
    if (scene.type === 'choice' && !scene.choices.includes(scene.correctAnswer)) failures.push(`选择题答案不在选项内：${scene.id}`);
    if (scene.type === 'tapObjects' && (!scene.targets || scene.targets.length < 2)) failures.push(`物体点击场景至少需要两个目标：${scene.id}`);
    if (scene.type === 'repeatTap' && !scene.requiredCount) failures.push(`重复点击场景缺少 requiredCount：${scene.id}`);
  });

  if (failures.length > 0) {
    showToast('Demo 自检失败，请检查数据');
    console.warn('[Interactive Demo self-test]', failures);
  }
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function hideAllViews() {
  ['homeView', 'interactiveView', 'resultView'].forEach((id) => $(id).classList.add('hidden'));
}

function renderTopStatus() {
  const label = state.progress.completed
    ? `🏅 已完成 · 最高 ${state.progress.bestStars}⭐`
    : `⭐ 最高 ${state.progress.bestStars || 0}⭐`;
  $('topStatus').textContent = state.isSpeaking ? `🔊 朗读中 · ${label}` : label;
}

function showHome() {
  stopSpeaking();
  hideAllViews();
  renderTopStatus();
  $('homeView').classList.remove('hidden');
}

function startStory() {
  stopSpeaking();
  resetRuntime();
  hideAllViews();
  renderScene();
  $('interactiveView').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function leaveStory() {
  if (!confirm('要离开互动故事吗？当前这次进度会停止。')) return;
  showHome();
}

function renderScene() {
  const scene = currentScene();
  const progress = Math.round(((state.sceneIndex + 1) / interactiveStory.scenes.length) * 100);

  $('sceneStepText').textContent = `${state.sceneIndex + 1}/${interactiveStory.scenes.length}`;
  $('sceneProgressBar').style.width = `${progress}%`;
  $('sceneGoal').textContent = scene.goal;
  $('sceneTitle').textContent = scene.title;
  $('hintText').textContent = scene.hint;
  $('speakSceneButton').disabled = !canSpeak;
  $('speakSceneButton').textContent = canSpeak ? '🔊 播放这一句' : '浏览器不支持朗读';

  renderStoryLine(scene);
  renderVisualScene(scene);
  renderInteraction(scene);
  renderSceneActions();
  renderTopStatus();
}

function renderStoryLine(scene) {
  const text = scene.text;
  const words = extractKeywords(scene);
  let html = text;

  words.forEach((word) => {
    const className = state.activeWord === word ? 'word-active' : '';
    html = html.replaceAll(word, `<span class="${className}">${word}</span>`);
  });

  $('storyLine').innerHTML = html;
}

function extractKeywords(scene) {
  if (scene.id === 'emotion') return ['不想', '刷牙'];
  if (scene.id === 'objects') return ['牙刷', '清水'];
  if (scene.id === 'brush') return ['刷', '干净'];
  if (scene.id === 'result') return ['干净', '好看'];
  return [];
}

function renderVisualScene(scene) {
  const cleanClass = state.brushCount >= 3 || scene.id === 'result' && state.resultSparkled
    ? 'clean-3'
    : state.brushCount === 2
      ? 'clean-2'
      : state.brushCount === 1
        ? 'clean-1'
        : '';

  const bearMood = scene.id === 'emotion'
    ? 'sad no'
    : state.brushCount >= 3 || scene.id === 'result'
      ? 'happy'
      : '';

  const showCup = scene.id === 'objects';
  const showTooth = scene.id === 'objects' || scene.id === 'brush' || scene.id === 'result';
  const brushWiggle = scene.id === 'brush';

  $('visualScene').innerHTML = `
    <div class="scene-floor"></div>
    ${createBearMarkup(bearMood)}
    ${showTooth ? `<button class="object-target" style="right: 12%; bottom: 84px; width: 120px; height: 120px;" type="button" id="toothTarget" aria-label="牙齿"><div class="tooth ${cleanClass}"></div></button>` : ''}
    <button class="object-target" style="left: 9%; bottom: 94px; width: 168px; height: 82px;" type="button" id="brushTarget" aria-label="牙刷"><div class="toothbrush ${brushWiggle ? 'wiggle' : ''}"></div></button>
    ${showCup ? `<button class="object-target" style="left: 16%; bottom: 52px; width: 80px; height: 90px;" type="button" id="cupTarget" aria-label="水"><div class="cup"></div></button>` : ''}
  `;

  bindSceneObjectEvents(scene);
  renderBubblesAndSparkles();
}

function createBearMarkup(moodClass) {
  return `
    <div class="bear ${moodClass}">
      <div class="bear-ear left"></div>
      <div class="bear-ear right"></div>
      <div class="bear-body"></div>
      <div class="bear-head">
        <div class="eye left"></div>
        <div class="eye right"></div>
        <div class="bear-face"></div>
        <div class="mouth"></div>
      </div>
    </div>
  `;
}

function bindSceneObjectEvents(scene) {
  const brushTarget = $('brushTarget');
  const cupTarget = $('cupTarget');
  const toothTarget = $('toothTarget');

  if (scene.type === 'tapObjects') {
    brushTarget?.addEventListener('click', () => markObjectFound('toothbrush', '你找到牙刷啦！'));
    cupTarget?.addEventListener('click', () => markObjectFound('water', '你找到清水啦！'));
  }

  if (scene.type === 'repeatTap') {
    enableBrushDrag(brushTarget, toothTarget);
  }

  if (scene.type === 'tapFinish') {
    toothTarget?.addEventListener('click', finishSparkle);
  }
}

function renderBubblesAndSparkles() {
  const scene = $('visualScene');

  if (state.brushCount > 0) {
    for (let index = 0; index < state.brushCount * 5; index += 1) {
      const bubble = document.createElement('span');
      bubble.className = 'bubble';
      bubble.style.left = `${52 + Math.random() * 22}%`;
      bubble.style.bottom = `${110 + Math.random() * 45}px`;
      bubble.style.width = `${14 + Math.random() * 16}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.animationDelay = `${Math.random() * .35}s`;
      scene.appendChild(bubble);
    }
  }

  if (state.brushCount >= 3 || state.resultSparkled) {
    for (let index = 0; index < 7; index += 1) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.textContent = '✨';
      sparkle.style.right = `${12 + Math.random() * 18}%`;
      sparkle.style.bottom = `${145 + Math.random() * 75}px`;
      sparkle.style.animationDelay = `${Math.random() * .28}s`;
      scene.appendChild(sparkle);
    }
  }
}

function renderInteraction(scene) {
  const panel = $('interactionPanel');

  if (scene.type === 'choice') {
    panel.innerHTML = `
      <div class="choice-grid">
        ${scene.choices.map((choice) => {
          const selected = state.answers[scene.id] === choice;
          const isCorrect = selected && choice === scene.correctAnswer;
          const isWrong = selected && choice !== scene.correctAnswer;
          return `<button class="choice-btn ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}" data-choice="${choice}" type="button">${choice === '不想' ? '😝' : '😊'} ${choice}</button>`;
        }).join('')}
      </div>
    `;
    panel.querySelectorAll('[data-choice]').forEach((button) => {
      button.addEventListener('click', () => handleChoice(button.dataset.choice));
    });
    return;
  }

  if (scene.type === 'tapObjects') {
    const foundCount = state.foundTargets.size;
    panel.innerHTML = `
      <div class="choice-grid">
        ${scene.targets.map((target) => `<button class="action-card ${state.foundTargets.has(target.id) ? 'done' : ''}" data-target="${target.id}" type="button">${state.foundTargets.has(target.id) ? '✅' : '👆'} ${target.label}</button>`).join('')}
      </div>
      <p class="hint-text">已找到 ${foundCount}/${scene.targets.length}</p>
    `;
    panel.querySelectorAll('[data-target]').forEach((button) => {
      const target = scene.targets.find((item) => item.id === button.dataset.target);
      button.addEventListener('click', () => markObjectFound(target.id, `你找到${target.label}啦！`));
    });
    return;
  }

  if (scene.type === 'repeatTap') {
    panel.innerHTML = `
      <div class="action-card">🪥 按住上面的牙刷，拖到牙齿上刷一刷</div>
      <div class="clean-meter" aria-label="清洁进度"><div style="width: ${(state.brushCount / scene.requiredCount) * 100}%"></div></div>
      <p class="hint-text">刷牙进度：${state.brushCount}/${scene.requiredCount} · ${state.brushCount >= scene.requiredCount ? '牙齿刷干净啦！' : '拖动牙刷碰到牙齿会增加进度'}</p>
    `;
    return;
  }

  if (scene.type === 'tapFinish') {
    panel.innerHTML = `
      <button class="action-card ${state.resultSparkled ? 'done' : ''}" id="sparkleActionButton" type="button">${state.resultSparkled ? '✨ 牙齿亮晶晶' : '👆 点牙齿，让它亮起来'}</button>
    `;
    $('sparkleActionButton').addEventListener('click', finishSparkle);
  }
}

function renderSceneActions() {
  $('prevSceneButton').disabled = state.sceneIndex === 0;
  $('nextSceneButton').disabled = !isSceneComplete(currentScene());
  $('nextSceneButton').textContent = state.sceneIndex === interactiveStory.scenes.length - 1 ? '完成故事 🏅' : '下一步 ›';
}

function isSceneComplete(scene) {
  if (state.completedScenes.has(scene.id)) return true;
  if (scene.type === 'choice') return state.answers[scene.id] === scene.correctAnswer;
  if (scene.type === 'tapObjects') return scene.targets.every((target) => state.foundTargets.has(target.id));
  if (scene.type === 'repeatTap') return state.brushCount >= scene.requiredCount;
  if (scene.type === 'tapFinish') return state.resultSparkled;
  return false;
}

function completeScene(scene) {
  if (!state.completedScenes.has(scene.id)) {
    state.completedScenes.add(scene.id);
    state.stars += scene.reward?.stars || 0;
    if (scene.reward?.item) state.rewards.push(scene.reward.item);
  }
}

function handleChoice(choice) {
  const scene = currentScene();
  state.answers[scene.id] = choice;

  if (choice === scene.correctAnswer) {
    completeScene(scene);
    showToast('⭐ 对啦，小熊现在不想刷牙');
    speak('对啦，小熊现在不想刷牙。你观察得真仔细。', '观察反馈');
  } else {
    showToast('👀 再看看小熊的表情哦');
    speak('再看看小熊的表情哦，它在摇头。', '观察提示');
  }

  renderScene();
}

function markObjectFound(targetId, message) {
  const scene = currentScene();
  const target = scene.targets?.find((item) => item.id === targetId);
  if (!target) return;

  state.foundTargets.add(targetId);
  showToast(message);
  speak(target.speech, target.label);

  if (isSceneComplete(scene)) {
    completeScene(scene);
    window.setTimeout(() => speak('牙刷和清水都找到了。真棒！', '找物反馈'), 450);
  }

  renderScene();
}

function enableBrushDrag(brushTarget, toothTarget) {
  if (!brushTarget || !toothTarget) return;

  brushTarget.classList.add('draggable-brush');
  brushTarget.addEventListener('pointerdown', (event) => startBrushDrag(event, brushTarget, toothTarget));
}

function startBrushDrag(event, brushTarget, toothTarget) {
  if (currentScene().type !== 'repeatTap') return;

  event.preventDefault();
  state.isDraggingBrush = true;
  brushTarget.classList.add('dragging');
  brushTarget.setPointerCapture?.(event.pointerId);
  moveBrushToPointer(event, brushTarget);

  const handleMove = (moveEvent) => {
    if (!state.isDraggingBrush) return;
    moveBrushToPointer(moveEvent, brushTarget);
    checkBrushToothHit(brushTarget, toothTarget);
  };

  const handleUp = () => {
    state.isDraggingBrush = false;
    brushTarget.classList.remove('dragging');
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleUp);
    window.removeEventListener('pointercancel', handleUp);

    if (state.brushCount < currentScene().requiredCount) {
      showToast('继续拖到牙齿上刷一刷');
    }
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleUp);
  window.addEventListener('pointercancel', handleUp);
}

function moveBrushToPointer(event, brushTarget) {
  const sceneRect = $('visualScene').getBoundingClientRect();
  const x = event.clientX - sceneRect.left - brushTarget.offsetWidth / 2;
  const y = event.clientY - sceneRect.top - brushTarget.offsetHeight / 2;
  const safeX = Math.max(0, Math.min(sceneRect.width - brushTarget.offsetWidth, x));
  const safeY = Math.max(0, Math.min(sceneRect.height - brushTarget.offsetHeight, y));

  brushTarget.style.left = `${safeX}px`;
  brushTarget.style.top = `${safeY}px`;
  brushTarget.style.bottom = 'auto';
}

function checkBrushToothHit(brushTarget, toothTarget) {
  if (state.brushHitCooldown || state.brushCount >= currentScene().requiredCount) return;

  const brushRect = brushTarget.getBoundingClientRect();
  const toothRect = toothTarget.getBoundingClientRect();
  const overlap = !(brushRect.right < toothRect.left || brushRect.left > toothRect.right || brushRect.bottom < toothRect.top || brushRect.top > toothRect.bottom);

  if (!overlap) return;

  state.brushHitCooldown = true;
  registerBrushStroke();
  window.setTimeout(() => {
    state.brushHitCooldown = false;
  }, 520);
}

function registerBrushStroke() {
  const scene = currentScene();
  if (scene.type !== 'repeatTap') return;

  state.brushCount = Math.min(scene.requiredCount, state.brushCount + 1);
  const feedback = scene.feedback[state.brushCount - 1] || '继续刷一刷。';
  showToast(state.brushCount >= scene.requiredCount ? '✨ 牙齿变干净啦！' : '🫧 ' + feedback);
  speak(feedback, '刷牙反馈');

  if (state.brushCount >= scene.requiredCount) {
    completeScene(scene);
  }

  renderScene();
}

function finishSparkle() {
  const scene = currentScene();
  state.resultSparkled = true;
  completeScene(scene);
  showToast('✨ 亮晶晶，真好看！');
  speak('亮晶晶，真好看！你帮小熊养成了好习惯。', '完成反馈');
  renderScene();
}

function goPrevScene() {
  stopSpeaking();
  if (state.sceneIndex > 0) {
    state.sceneIndex -= 1;
    renderScene();
  }
}

function goNextScene() {
  const scene = currentScene();
  if (!isSceneComplete(scene)) return;

  stopSpeaking();

  if (state.sceneIndex < interactiveStory.scenes.length - 1) {
    state.sceneIndex += 1;
    renderScene();
    return;
  }

  showResult();
}

function showResult() {
  stopSpeaking();
  hideAllViews();

  state.progress.completed = true;
  state.progress.bestStars = Math.max(state.progress.bestStars || 0, state.stars);
  saveProgress();

  $('resultStars').textContent = `${state.stars}⭐`;
  $('resultItems').textContent = `获得：${state.rewards.join(' · ')} · ${interactiveStory.badge}`;
  renderTopStatus();
  $('resultView').classList.remove('hidden');
  showToast('🏅 你是护牙小卫士！');
}

function resetSavedProgress() {
  if (!confirm('确定清空本机试玩进度吗？')) return;
  state.progress = { completed: false, bestStars: 0 };
  saveProgress();
  renderTopStatus();
  showToast('进度已清空');
}

function highlightWordsForSpeech(text) {
  const words = extractKeywords(currentScene());
  const firstWord = words.find((word) => text.includes(word));
  state.activeWord = firstWord || '';
  renderStoryLine(currentScene());
  window.setTimeout(() => {
    state.activeWord = '';
    if (!$('interactiveView').classList.contains('hidden')) renderStoryLine(currentScene());
  }, 1100);
}

function speak(text, title = '内容') {
  if (!canSpeak || !text) return;

  window.speechSynthesis.cancel();
  state.lastAudio = { text, title };
  state.isPaused = false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.72;
  utterance.pitch = 1.08;

  utterance.onstart = () => {
    state.isSpeaking = true;
    updateAudioBar();
    renderTopStatus();
    highlightWordsForSpeech(text);
  };

  utterance.onend = () => {
    state.isSpeaking = false;
    state.isPaused = false;
    state.activeWord = '';
    updateAudioBar();
    renderTopStatus();
    if (!$('interactiveView').classList.contains('hidden')) renderStoryLine(currentScene());
  };

  utterance.onerror = utterance.onend;
  window.speechSynthesis.speak(utterance);
}

function speakCurrentScene() {
  const scene = currentScene();
  speak(scene.text, scene.title);
}

function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
  state.isSpeaking = false;
  state.isPaused = false;
  state.activeWord = '';
  updateAudioBar();
  renderTopStatus();
  if (!$('interactiveView').classList.contains('hidden')) renderStoryLine(currentScene());
}

function pauseOrResumeSpeaking() {
  if (!canSpeak) return;

  if (state.isPaused) {
    window.speechSynthesis.resume();
    state.isPaused = false;
    state.isSpeaking = true;
  } else {
    window.speechSynthesis.pause();
    state.isPaused = true;
    state.isSpeaking = false;
  }

  updateAudioBar();
  renderTopStatus();
}

function replayAudio() {
  if (state.lastAudio.text) speak(state.lastAudio.text, state.lastAudio.title);
}

function updateAudioBar() {
  const visible = state.isSpeaking || state.isPaused;
  $('audioBar').classList.toggle('show', visible);
  $('audioTitle').textContent = state.isPaused ? `已暂停：${state.lastAudio.title}` : `正在朗读：${state.lastAudio.title}`;
  $('pauseButton').textContent = state.isPaused ? '▶ 继续' : '⏸ 暂停';
}

function bindEvents() {
  $('homeButton').addEventListener('click', () => {
    if (!$('interactiveView').classList.contains('hidden') && !confirm('要离开互动故事吗？')) return;
    showHome();
  });
  $('startInteractiveButton').addEventListener('click', startStory);
  $('resetProgressButton').addEventListener('click', resetSavedProgress);
  $('leaveStoryButton').addEventListener('click', leaveStory);
  $('speakSceneButton').addEventListener('click', speakCurrentScene);
  $('prevSceneButton').addEventListener('click', goPrevScene);
  $('nextSceneButton').addEventListener('click', goNextScene);
  $('replayStoryButton').addEventListener('click', startStory);
  $('goHomeButton').addEventListener('click', showHome);
  $('pauseButton').addEventListener('click', pauseOrResumeSpeaking);
  $('replayAudioButton').addEventListener('click', replayAudio);
  $('stopAudioButton').addEventListener('click', stopSpeaking);
  window.addEventListener('beforeunload', stopSpeaking);
}

function init() {
  $('speechStatus').textContent = canSpeak ? '✨ 当前浏览器支持朗读' : '✨ 当前浏览器不支持朗读，仍可看动画互动';
  loadProgress();
  runSelfTests();
  bindEvents();
  showHome();
}

init();
