@font-face {
  font-family: 'CrayonHandRegular2016Demo';
  src: url('fonts/CrayonHandRegular2016Demo.ttf') format('truetype');
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #ECE6D4;
  color: #9D9D8C;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── BACKGROUND ── */
#notes-background {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #ECE6D4;
}

/* ── EDITOR PANEL ── */
#editor-panel {
  background: #ECE6D4;
  border-top: 1.5px solid #9D9D8C;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

/* ── TOOLBAR ── */
#toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
}

#toolbar button {
  background: #ECE6D4;
  color: #9D9D8C;
  border: 1.5px solid #9D9D8C;
  padding: 4px 12px;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

#toolbar button:hover {
  background: #9D9D8C;
  color: #ECE6D4;
}

#btn-publish {
  margin-left: auto;
  background: #9D9D8C;
  color: #ECE6D4;
  font-weight: bold;
  border: 1.5px solid #9D9D8C;
}

#btn-publish:hover {
  background: #ECE6D4;
  color: #9D9D8C;
}

/* ── FONT SIZE PICKER ── */
#font-size-picker {
  background: #ECE6D4;
  color: #9D9D8C;
  border: 1.5px solid #9D9D8C;
  padding: 4px 8px;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: 15px;
  cursor: pointer;
  outline: none;
}

#font-size-picker:hover {
  background: #9D9D8C;
  color: #ECE6D4;
}

#font-size-picker option {
  background: #ECE6D4;
  color: #9D9D8C;
}

/* ── RETRO WINDOW BOX ── */
.retro-window {
  border: 1.5px solid #9D9D8C;
  width: 100%;
  max-width: 520px;
  align-self: center;
  background: #ECE6D4;
  color: #9D9D8C;
}

.retro-titlebar {
  background: #9D9D8C;
  border-bottom: 1.5px solid #9D9D8C;
  padding: 3px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #ECE6D4;
  font-family: 'CrayonHandRegular2016Demo', monospace;
}

.retro-controls {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.retro-controls span {
  border: 1px solid #ECE6D4;
  padding: 0 5px;
  cursor: pointer;
  background: #9D9D8C;
  color: #ECE6D4;
}

.retro-content {
  padding: 10px 12px;
  min-height: 120px;
  max-height: 220px;
  overflow-y: auto;
}

#editor {
  outline: none;
  min-height: 100px;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: 16px;
  line-height: 1.7;
  color: #9D9D8C;
}

#editor p {
  margin: 2px 0;
}

/* ── TO-DO ITEM ── */
.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 3px 0;
  min-height: 28px;
}

.todo-checkbox {
  width: 16px;
  height: 16px;
  min-width: 16px;
  border: 1.5px solid #9D9D8C;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 1;
  user-select: none;
  color: #9D9D8C;
}

.todo-text {
  outline: none;
  flex: 1;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: inherit;
  color: #9D9D8C;
  min-width: 0;
  word-break: break-word;
}

/* ── BULLET ITEM ── */
.bullet-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 3px 0;
  min-height: 28px;
}

.bullet-dot {
  width: 7px;
  height: 7px;
  min-width: 7px;
  background: #9D9D8C;
  border-radius: 50%;
  flex-shrink: 0;
}

.bullet-text {
  outline: none;
  flex: 1;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: inherit;
  color: #9D9D8C;
  min-width: 0;
  word-break: break-word;
}

/* ── PUBLISHED NOTES ── */
.published-note {
  position: absolute;
  width: 220px;
  background: #ECE6D4;
  color: #9D9D8C;
  border: 1.5px solid #9D9D8C;
  font-family: 'CrayonHandRegular2016Demo', monospace;
  font-size: 13px;
  cursor: grab;
  user-select: none;
  box-shadow: 3px 3px 0px #9D9D8C;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.published-note .retro-titlebar {
  background: #9D9D8C;
  cursor: grab;
  color: #ECE6D4;
}

.published-note .retro-content {
  padding: 8px 10px;
  max-height: 180px;
  overflow: hidden;
}

.published-note .todo-checkbox {
  border-color: #9D9D8C;
  color: #9D9D8C;
}

.published-note .bullet-dot {
  background: #9D9D8C;
}
