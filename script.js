const editor = document.getElementById('editor');
const background = document.getElementById('notes-background');

// ── Clear placeholder on first click ──
editor.addEventListener('focus', () => {
  if (editor.innerText.trim() === 'Start typing here...') {
    editor.innerHTML = '<p></p>';
  }
});

// ── FONT SIZE PICKER ──
document.getElementById('font-size-picker').addEventListener('change', (e) => {
  editor.style.fontSize = e.target.value;
});

// ── STRIKETHROUGH BUTTON ──
document.getElementById('btn-strikethrough').addEventListener('click', () => {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.className = 'strikethrough';
  range.surroundContents(span);
});

// ── TO-DO BUTTON ──
document.getElementById('btn-todo').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'todo-item';

  const box = document.createElement('span');
  box.className = 'todo-checkbox';
  box.textContent = '';
  box.addEventListener('click', () => {
    box.classList.toggle('done');
    box.textContent = box.classList.contains('done') ? '★' : '';
  });

  const text = document.createElement('span');
  text.contentEditable = 'true';
  text.textContent = 'Task...';
  text.style.outline = 'none';
  text.style.flex = '1';
  text.style.fontFamily = "'CrayonHandRegular2016Demo', monospace";

  div.appendChild(box);
  div.appendChild(text);

  const sel = window.getSelection();
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.collapse(false);
    range.insertNode(div);
    range.setStartAfter(div);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    editor.appendChild(div);
  }

  text.focus();
});

// ── BULLET BUTTON ──
document.getElementById('btn-bullet').addEventListener('click', () => {
  const p = document.createElement('p');
  p.textContent = '• ';
  p.contentEditable = 'true';

  const sel = window.getSelection();
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.collapse(false);
    range.insertNode(p);
    range.setStartAfter(p);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    editor.appendChild(p);
  }
  p.focus();
});

// ── PUBLISH BUTTON ──
document.getElementById('btn-publish').addEventListener('click', () => {
  const content = editor.innerHTML.trim();
  if (!content || content === '<p></p>') return;

  const note = document.createElement('div');
  note.className = 'published-note retro-window';

  const titlebar = document.createElement('div');
  titlebar.className = 'retro-titlebar';
  titlebar.innerHTML = `
    <span class="retro-title">note</span>
    <div class="retro-controls">
      <span onclick="this.closest('.published-note').remove()">✕</span>
    </div>
  `;

  const noteContent = document.createElement('div');
  noteContent.className = 'retro-content';
  noteContent.innerHTML = content;

  // Re-attach checkbox click events for published todo items
  noteContent.querySelectorAll('.todo-checkbox').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('done');
      box.textContent = box.classList.contains('done') ? '★' : '';
    });
  });

  note.appendChild(titlebar);
  note.appendChild(noteContent);

  // Random position on background
  const bgW = background.clientWidth;
  const bgH = background.clientHeight;
  const x = Math.random() * (bgW - 240);
  const y = Math.random() * (bgH - 200);
  note.style.left = x + 'px';
  note.style.top  = y + 'px';

  background.appendChild(note);

  // Make it draggable
  makeDraggable(note, titlebar);

  // Clear editor
  editor.innerHTML = '<p></p>';
  editor.focus();
});

// ── DRAGGABLE notes ──
function makeDraggable(el, handle) {
  let startX, startY, startL, startT;

  handle.addEventListener('mousedown', e => {
    startX = e.clientX;
    startY = e.clientY;
    startL = parseInt(el.style.left) || 0;
    startT = parseInt(el.style.top)  || 0;
    el.style.cursor = 'grabbing';

    function onMove(e) {
      el.style.left = (startL + e.clientX - startX) + 'px';
      el.style.top  = (startT + e.clientY - startY) + 'px';
    }

    function onUp() {
      el.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}
