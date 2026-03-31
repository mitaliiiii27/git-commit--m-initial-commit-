// ----- Chatbot (Smarter) -----
if(document.getElementById('chatForm')) {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatContainer = document.getElementById('chatContainer');

  const chatHistory = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  chatHistory.forEach(m => addChatBubble(m.user, m.bot));

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if(!userMessage) return;

    const botResponse = getBotResponse(userMessage);
    addChatBubble(userMessage, botResponse);

    chatHistory.push({user:userMessage, bot:botResponse});
    localStorage.setItem('chatMessages', JSON.stringify(chatHistory));
    chatInput.value = '';
  });

  function addChatBubble(user, bot) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('chat-bubble','chat-user');
    userDiv.textContent = user;
    chatContainer.appendChild(userDiv);

    const botDiv = document.createElement('div');
    botDiv.classList.add('chat-bubble','chat-bot');
    botDiv.textContent = bot;
    chatContainer.appendChild(botDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // --- Smarter AI logic ---
  function getBotResponse(message) {
    const msg = message.toLowerCase();

    if(msg.includes('anxious') || msg.includes('anxiety')) {
      return "I understand. Anxiety can be really tough. Try taking a few deep breaths and maybe write down what's worrying you.";
    }
    if(msg.includes('stress') || msg.includes('overwhelmed') || msg.includes('work')) {
      return "Work and stress can feel heavy. Remember to take small breaks and focus on one task at a time.";
    }
    if(msg.includes('sad') || msg.includes('depressed') || msg.includes('unhappy')) {
      return "It's okay to feel sad. Talking about it can help. I'm here to listen.";
    }
    if(msg.includes('sleep') || msg.includes('insomnia') || msg.includes('tired')) {
      return "Sleep is important. Try avoiding screens before bed and doing some calming breathing exercises.";
    }
    if(msg.includes('happy') || msg.includes('good') || msg.includes('excited')) {
      return "That's wonderful! Keep doing things that make you feel this way.";
    }

    // ----- Mood Tracker with Suggestions -----
if(document.getElementById('moodForm')) {
  const moodForm = document.getElementById('moodForm');
  const moodInput = document.getElementById('moodInput');
  const noteInput = document.getElementById('noteInput');
  const moodList = document.getElementById('moodList');

  const moods = JSON.parse(localStorage.getItem('moodEntries') || '[]');
  moods.forEach(entry => addMoodEntry(entry.mood, entry.note, entry.date, entry.suggestion));

  moodForm.addEventListener('submit', e => {
    e.preventDefault();
    const mood = moodInput.value.trim().toLowerCase();
    const note = noteInput.value.trim();
    const date = new Date().toLocaleDateString();
    if(!mood) return;

    const suggestion = getMoodSuggestion(mood);
    addMoodEntry(mood, note, date, suggestion);
    moods.push({mood, note, date, suggestion});
    localStorage.setItem('moodEntries', JSON.stringify(moods));

    moodInput.value = '';
    noteInput.value = '';
  });

  function addMoodEntry(mood, note, date, suggestion) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${date} - Mood:</strong> ${mood} ${note ? "- Note: " + note : ""} ${suggestion ? "<br><em>Tip: " + suggestion + "</em>" : ""}`;
    moodList.appendChild(li);
  }

  function getMoodSuggestion(mood) {
    if(mood.includes('sad') || mood.includes('depressed') || mood.includes('unhappy')) {
      return "Try talking to someone you trust or take a short walk outside.";
    }
    if(mood.includes('anxious') || mood.includes('nervous') || mood.includes('worried')) {
      return "Take 5 deep breaths or try a short meditation exercise.";
    }
    if(mood.includes('stressed') || mood.includes('overwhelmed') || mood.includes('work')) {
      return "Take a break, stretch, or focus on one small task at a time.";
    }
    if(mood.includes('happy') || mood.includes('good') || mood.includes('excited')) {
      return "Keep doing what makes you feel good! Celebrate small wins.";
    }
    if(mood.includes('tired') || mood.includes('sleepy')) {
      return "Try resting or taking a short power nap.";
    }
    return "Keep tracking your mood! Reflecting on it is already helpful.";
  }
}

    // Default response
    return "Thank you for sharing. Can you tell me a bit more about how you're feeling?";
  }
}