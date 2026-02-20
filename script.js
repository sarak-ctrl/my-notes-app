const editor = document.getElementById('editor');
const background = document.getElementById('notes-background');

// ── SAVE TO LOCALSTORAGE ──
function saveToStorage() {
  const notes = [];
  document.querySelectorAll('.published-note').forEach(note => {
    notes.push({
      html: note.querySelector('.retro-content').innerHTML,
      left: note.style.left,
      top: note.style.top
    });
  });
  localStorage.setItem('saved-notes', JSON.stringify(notes));
}

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

// ── CREATE TODO ITEM ──
function createTodoItem(textContent = '') {
  const div = document.createElement('div');
  div.className = 'todo-item';
  div.setAttribute('contenteditable', 'false');

  const box = document.createElement('span');
  box.className = 'todo-checkbox';
  box.setAttribute('contenteditable', 'false');
  box.addEventListener('click', () => {
    const isDone = box.getAttribute('data-done') === 'true';
    box.setAttribute('data-done', !isDone);
    box.textContent = !isDone ? '★' : '';
  });

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.setAttribute('contenteditable', 'true');
  if (textContent) text.textContent = textContent;

  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTodo = createTodoItem();
      div.parentNode.insertBefore(newTodo, div.nextSibling);
      newTodo.querySelector('.todo-text').focus();
    }
    if (e.key === 'Backspace' && text.innerText.trim() === '') {
      e.preventDefault();
      const prev = div.previousSibling;
      div.remove();
      if (prev) {
        const prevText = prev.querySelector('.todo-text, .bullet-text');
        if (prevText) prevText.focus();
      }
    }
  });

  div.appendChild(box);
  div.appendChild(text);
  return div;
}

// ── CREATE BULLET ITEM ──
function createBulletItem(textContent = '') {
  const div = document.createElement('div');
  div.className = 'bullet-item';
  div.setAttribute('contenteditable', 'false');

  const dot = document.createElement('span');
  dot.className = 'bullet-dot';
  dot.setAttribute('contenteditable', 'false');

  const text = document.createElement('span');
  text.className = 'bullet-text';
  text.setAttribute('contenteditable', 'true');
  if (textContent) text.textContent = textContent;

  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newBullet = createBulletItem();
      div.parentNode.insertBefore(newBullet, div.nextSibling);
      newBullet.querySelector('.bullet-text').focus();
    }
    if (e.key === 'Backspace' && text.innerText.trim() === '') {
      e.preventDefault();
      const prev = div.previousSibling;
      div.remove();
      if (prev) {
        const prevText = prev.querySelector('.todo-text, .bullet-text');
        if (prevText) prevText.focus();
      }
    }
  });

  div.appendChild(dot);
  div.appendChild(text);
  return div;
}

// ── TO-DO BUTTON ──
document.getElementById('btn-todo').addEventListener('click', () => {
  const todo = createTodoItem();
  editor.appendChild(todo);
  todo.querySelector('.todo-text').focus();
});

// ── BULLET BUTTON ──
document.getElementById('btn-bullet').addEventListener('click', () => {
  const bullet = createBulletItem();
  editor.appendChild(bullet);
  bullet.querySelector('.bullet-text').focus();
});

// ── ATTACH CHECKBOX EVENTS ──
function attachCheckboxEvents(container) {
  container.querySelectorAll('.todo-checkbox').forEach(box => {
    box.addEventListener('click', () => {
      const isDone = box.getAttribute('data-done') === 'true';
      box.setAttribute('data-done', !isDone);
      box.textContent = !isDone ? '★' : '';
    });
  });
}

// ── MAKE NOTE EDITABLE ──
function makeEditable(note) {
  const noteContent = note.querySelector('.retro-content');
  const titlebar = note.querySelector('.retro-titlebar');

  note.classList.add('editing');
  note.style.cursor = 'default';
  noteContent.contentEditable = 'true';
  noteContent.style.outline = 'none';
  noteContent.focus();

  note.querySelector('.note-save-btn').style.display = 'block';
  titlebar.onmousedown = null;
}

// ── SAVE NOTE EDITS ──
function saveNote(note) {
  const noteContent = note.querySelector('.retro-content');
  const titlebar = note.querySelector('.retro-titlebar');

  note.classList.remove('editing');
  note.style.cursor = 'grab';
  noteContent.contentEditable = 'false';
  note.querySelector('.note-save-btn').style.display = 'none';

  attachCheckboxEvents(noteContent);
  makeDraggable(note, titlebar);
}

// ── BUILD A NOTE ──
function buildNote(content) {
  const note = document.createElement('div');
  note.className = 'published-note retro-window';

  const titlebar = document.createElement('div');
  titlebar.className = 'retro-titlebar';

  const titleSpan = document.createElement('span');
  titleSpan.className = 'retro-title';
  titleSpan.textContent = 'note';

  const controls = document.createElement('div');
  controls.className = 'retro-controls';

  const editBtn = document.createElement('span');
  editBtn.className = 'edit-btn';
  editBtn.textContent = '✎';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (note.classList.contains('editing')) {
      saveNote(note);
      saveToStorage();
    } else {
      makeEditable(note);
    }
  });

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => {
    note.remove();
    saveToStorage();
  });

  controls.appendChild(editBtn);
  controls.appendChild(closeBtn);
  titlebar.appendChild(titleSpan);
  titlebar.appendChild(controls);

  const noteContent = document.createElement('div');
  noteContent.className = 'retro-content';
  noteContent.contentEditable = 'false';
  noteContent.innerHTML = content;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'note-save-btn';
  saveBtn.textContent = 'Save ✦';
  saveBtn.style.display = 'none';
  saveBtn.addEventListener('click', () => {
    saveNote(note);
    saveToStorage();
  });

  note.appendChild(titlebar);
  note.appendChild(noteContent);
  note.appendChild(saveBtn);

  attachCheckboxEvents(noteContent);
  return note;
}

// ── PUBLISH BUTTON ──
document.getElementById('btn-publish').addEventListener('click', () => {
  const content = editor.innerHTML.trim();
  if (!content || content === '<p></p>' || content === '<p><br></p>') return;

  const note = buildNote(content);

  const bgW = background.clientWidth;
  const bgH = background.clientHeight;
  note.style.left = Math.random() * (bgW - 260) + 'px';
  note.style.top  = Math.random() * (bgH - 220) + 'px';

  background.appendChild(note);
  makeDraggable(note, note.querySelector('.retro-titlebar'));
  saveToStorage();

  editor.innerHTML = '<p></p>';
  editor.focus();
});

// ── DRAGGABLE ──
function makeDraggable(el, handle) {
  let startX, startY, startL, startT;

  handle.onmousedown = (e) => {
    if (e.target.closest('.retro-controls')) return;
    if (el.classList.contains('editing')) return;

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
      saveToStorage();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
}

// ── LOAD SAVED NOTES ON STARTUP ──
window.addEventListener('load', () => {
  const saved = localStorage.getItem('saved-notes');
  if (!saved) return;
  JSON.parse(saved).forEach(data => {
    const note = buildNote(data.html);
    note.style.left = data.left;
    note.style.top = data.top;
    background.appendChild(note);
    makeDraggable(note, note.querySelector('.retro-titlebar'));
  });
});
