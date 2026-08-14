/**
 * EqualEdge AI — Floating Accessibility Chatbot Widget
 * Direct integration with Cloudflare Worker RAG Engine (https://equaledge-ai.thrivefusion.workers.dev/ask)
 * WCAG 2.2 AA Compliant, Keyboard Navigation, Focus Trap, ARIA Live Announcements
 */

(function () {
  'use strict';

  const WORKER_URL = 'https://equaledge-ai.thrivefusion.workers.dev';

  function initChatbot() {
    if (document.getElementById('ai-chatbot-widget')) return;

    // Chatbot Container
    const widget = document.createElement('div');
    widget.id = 'ai-chatbot-widget';
    widget.className = 'fixed bottom-6 right-6 z-50 font-sans';

    widget.innerHTML = `
      <!-- Floating Trigger Button -->
      <button id="ai-chatbot-trigger" 
              type="button" 
              aria-expanded="false" 
              aria-controls="ai-chatbot-panel" 
              aria-label="Open EqualEdge AI Assistant"
              class="flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 12.1"></path><path d="M12 12 19 5"></path>
        </svg>
        <span class="font-bold text-sm tracking-wide">EqualEdge AI</span>
      </button>

      <!-- Chat Modal Window -->
      <div id="ai-chatbot-panel" 
           role="dialog" 
           aria-label="EqualEdge AI Accessibility Assistant" 
           aria-hidden="true" 
           hidden
           class="fixed bottom-24 right-6 z-50 flex h-[540px] w-[calc(100vw-3rem)] sm:w-[400px] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-sm">
              ✨
            </div>
            <div>
              <h2 class="text-base font-extrabold leading-none text-foreground">EqualEdge AI</h2>
              <p class="mt-1 text-xs text-muted-foreground">RPwD Act & Accessibility Guidance</p>
            </div>
          </div>
          <button id="ai-chatbot-close" 
                  type="button" 
                  aria-label="Close EqualEdge AI Assistant" 
                  class="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Live Status Screen Reader Announcer -->
        <div id="ai-chat-status" role="status" aria-live="polite" class="sr-only"></div>

        <!-- Chat Log Area -->
        <div id="ai-chat-messages" 
             tabindex="0"
             aria-label="Chat Message History"
             class="flex-1 overflow-y-auto p-4 space-y-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
          
          <!-- Welcome Message -->
          <div class="rounded-2xl bg-muted/50 p-4 border border-border/40 text-card-foreground">
            <p class="font-semibold text-xs text-primary mb-1">EqualEdge AI Assistant</p>
            <p class="leading-relaxed">Hello! How can I assist you today regarding RPwD Act regulations, ThriveFusion accessibility services, or inclusive tech tools?</p>
            
            <div class="mt-3 flex flex-wrap gap-1.5" aria-label="Suggested Queries">
              <button type="button" class="ai-chip text-xs font-medium rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 transition-colors text-left">
                What are RPwD Act rights?
              </button>
              <button type="button" class="ai-chip text-xs font-medium rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 transition-colors text-left">
                How to get scribe support?
              </button>
              <button type="button" class="ai-chip text-xs font-medium rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 transition-colors text-left">
                How can I volunteer?
              </button>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <form id="ai-chat-form" class="border-t border-border/60 bg-background p-3 flex items-center gap-2">
          <label for="ai-chat-input" class="sr-only">Ask EqualEdge AI</label>
          <input id="ai-chat-input" 
                 type="text" 
                 required
                 minlength="2"
                 placeholder="Ask EqualEdge AI a question..." 
                 autoComplete="off"
                 class="flex-1 rounded-full border border-input bg-input/40 px-4 py-2 text-sm transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring outline-none" />
          <button id="ai-chat-send" 
                  type="submit" 
                  aria-label="Send query"
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(widget);

    // DOM Elements
    const trigger = document.getElementById('ai-chatbot-trigger');
    const panel = document.getElementById('ai-chatbot-panel');
    const closeBtn = document.getElementById('ai-chatbot-close');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    const messages = document.getElementById('ai-chat-messages');
    const status = document.getElementById('ai-chat-status');

    let isOpen = false;

    function togglePanel(open) {
      isOpen = typeof open === 'boolean' ? open : !isOpen;
      panel.hidden = !isOpen;
      panel.setAttribute('aria-hidden', String(!isOpen));
      trigger.setAttribute('aria-expanded', String(isOpen));
      
      if (isOpen) {
        input.focus();
        announce('EqualEdge AI Chatbot opened.');
      } else {
        trigger.focus();
        announce('EqualEdge AI Chatbot closed.');
      }
    }

    trigger.addEventListener('click', () => togglePanel());
    closeBtn.addEventListener('click', () => togglePanel(false));

    // Keyboard support (Escape to close)
    widget.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        togglePanel(false);
      }
    });

    // Sample prompt chips click handler
    panel.addEventListener('click', function (e) {
      const chip = e.target.closest('.ai-chip');
      if (chip) {
        const text = chip.textContent.trim();
        input.value = text;
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });

    // Form submit handler
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      appendUserMessage(question);
      input.value = '';
      setLoading(true);

      try {
        announce('Searching legal knowledge base and generating answer...');
        const res = await fetch(`${WORKER_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const answerText = data.answer || 'No relevant information found in knowledge base.';
        const sections = Array.isArray(data.sections_used) ? data.sections_used : [];
        appendAssistantMessage(answerText, sections);
        announce('Answer generated.');
      } catch (err) {
        console.error('[EqualEdge AI Chatbot Error]:', err);
        appendErrorMessage('Unable to connect to EqualEdge AI backend right now. Please verify network connection.');
        announce('Error retrieving response.');
      } finally {
        setLoading(false);
      }
    });

    function appendUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'my-2 p-3 rounded-2xl bg-primary/10 text-foreground ml-6 border border-primary/20 text-xs sm:text-sm font-medium';
      msg.textContent = text;
      messages.appendChild(msg);
      scrollToBottom();
    }

    function appendAssistantMessage(text, sections = []) {
      const msg = document.createElement('div');
      msg.className = 'my-2 p-3 rounded-2xl bg-card border border-border/80 text-foreground mr-6 shadow-xs text-xs sm:text-sm space-y-2';
      
      let html = `<p class="font-bold text-xs text-green-600 dark:text-green-400">✨ EqualEdge AI Response:</p><div class="leading-relaxed whitespace-pre-wrap">${escapeHTML(text)}</div>`;
      if (sections.length > 0) {
        html += `<div class="pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-medium">Cites RPwD Act: ${sections.map(s => `<span class="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold mr-1">Sec ${s}</span>`).join('')}</div>`;
      }

      msg.innerHTML = html;
      messages.appendChild(msg);
      scrollToBottom();
    }

    function appendErrorMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'my-2 p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 text-xs sm:text-sm font-medium';
      msg.textContent = text;
      messages.appendChild(msg);
      scrollToBottom();
    }

    function setLoading(loading) {
      sendBtn.disabled = loading;
      input.disabled = loading;
      if (loading) {
        const typing = document.createElement('div');
        typing.id = 'ai-typing-indicator';
        typing.className = 'my-2 p-3 rounded-2xl bg-muted/40 text-muted-foreground mr-6 text-xs italic animate-pulse';
        typing.textContent = 'EqualEdge AI is thinking...';
        messages.appendChild(typing);
        scrollToBottom();
      } else {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) indicator.remove();
      }
    }

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    function announce(msg) {
      status.textContent = msg;
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
