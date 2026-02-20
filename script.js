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

// ── Helper: create a todo item ──
function createTodoItem(textContent = '') {
  const div = document.createElement('div');
  div.className = 'todo-item';
  div.setAttribute('data-type', 'todo');

  const box = document.createElement('span');
  box.className = 'todo-checkbox';
  box.addEventListener('click', () => {
    const isDone = box.getAttribute('data-done') === 'true';
    box.setAttribute('data-done', !isDone);
    box.textContent = !isDone ? '★' : '';
  });

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.contentEditable = 'true';
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

// ── Helper: create a bullet item ──
function createBulletItem(textContent = '') {
  const div = document.createElement('div');
  div.className = 'bullet-item';
  div.setAttribute('data-type', 'bullet');

  const dot = document.createElement('span');
  dot.className = 'bullet-dot';

  const text = document.createElement('span');
  text.className = 'bullet-text';
  text.contentEditable = 'true';
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

// ── Helper: attach checkbox events ──
function attachCheckboxEvents(container) {
  container.querySelectorAll('.todo-checkbox').forEach(box => {
    box.addEventListener('click', () => {
      const isDone = box.getAttribute('data-done') === 'true';
      box.setAttribute('data-done', !isDone);
      box.textContent = !isDone ? '★' : '';
    });
  });
}

// ── Helper: make note editable ──
function makeEditable(note) {
  const noteContent = note.querySelector('.retro-content');
  const titlebar = note.querySelector('.retro-titlebar');
  const title = note.querySelector('.retro-title');

  note.classList.add('editing');
  note.style.cursor = 'default';
  noteContent.contentEditable = 'true';
  noteContent.style.outline = 'none';
  noteContent.focus();

  // Change edit button to done indicator
  const editBtn = note.querySelector('.edit-btn');
  if (editBtn) editBtn.textContent = '✎';

  // Show save button
  note.querySelector('.note-save-btn').style.display = 'block';

  // Disable dragging while editing
  titlebar.onmousedown = null;
}

// ── Helper: save note edits ──
function saveNote(note) {
  const noteContent = note.querySelector('.retro-content');
  const titlebar = note.querySelector('.retro-titlebar');

  note.classList.remove('editing');
  note.style.cursor = 'grab';
  noteContent.contentEditable = 'false';

  // Change edit button back
  const editBtn = note.querySelector('.edit-btn');
  if (editBtn) editBtn.textContent = '✎';

  // Hide save button
  note.querySelector('.note-save-btn').style.display = 'none';

  // Re-attach checkbox events after editing
  attachCheckboxEvents(noteContent);

  // Re-enable dragging
  makeDraggable(note, titlebar);
}

// ── PUBLISH BUTTON ──
document.getElementById('btn-publish').addEventListener('click', () => {
  const content = editor.innerHTML.trim();
  if (!content || content === '<p></p>' || content === '<p><br></p>') return;

  const note = document.createElement('div');
  note.className = 'published-note retro-window';

  // Title bar with edit and close buttons
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
  editBtn.title = 'Edit note';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (note.classList.contains('editing')) {
      saveNote(note);
    } else {
      makeEditable(note);
    }
  });

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => note.remove());

  controls.appendChild(editBtn);
  controls.appendChild(closeBtn);
  titlebar.appendChild(titleSpan);
  titlebar.appendChild(controls);

  // Note content
  const noteContent = document.createElement('div');
  noteContent.className = 'retro-content';
  noteContent.contentEditable = 'false';
  noteContent.innerHTML = content;

  // Save button (hidden by default)
  const saveBtn = document.createElement('button');
  saveBtn.className = 'note-save-btn';
  saveBtn.textContent = 'Save ✦';
  saveBtn.style.display = 'none';
  saveBtn.addEventListener('click', () => saveNote(note));

  note.appendChild(titlebar);
  note.appendChild(noteContent);
  note.appendChild(saveBtn);

  // Attach checkbox events
  attachCheckboxEvents(noteContent);

  // Random position
  const bgW = background.clientWidth;
  const bgH = background.clientHeight;
  const x = Math.random() * (bgW - 260);
  const y = Math.random() * (bgH - 220);
  note.style.left = x + 'px';
  note.style.top  = y + 'px';

  background.appendChild(note);
  makeDraggable(note, titlebar);

  // Clear editor
  editor.innerHTML = '<p></p>';
  editor.focus();
});

// ── DRAGGABLE ──
function makeDraggable(el, handle) {
  let startX, startY, startL, startT;

  handle.onmousedown = (e) => {
    // Don't drag if clicking a control button
    if (e.target.closest('.retro-controls')) return;
    // Don't drag if note is being edited
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
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
}
