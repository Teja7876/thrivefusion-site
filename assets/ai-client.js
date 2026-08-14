/**
 * EqualEdge AI — Accessible Client Query Handler
 * Connects Frontend Portal (ai.html) to Cloudflare Worker RAG Engine (/ask)
 * WCAG 2.2 AA Compliant with Keyboard Navigation & ARIA Live Announcements
 */

(function () {
  'use strict';

  const WORKER_ENDPOINT = 'https://equaledge-ai.equaledge1ai.workers.dev/ask';

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('ai-query-form');
    const input = document.getElementById('ai-query-input');
    const submitBtn = document.getElementById('ai-submit-btn');
    const statusRegion = document.getElementById('ai-status-region');
    const resultsContainer = document.getElementById('ai-results-container');
    const sampleButtons = document.querySelectorAll('.ai-sample-query');

    if (!form || !input || !resultsContainer) return;

    // Handle Sample Query Clicks
    sampleButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const queryText = this.getAttribute('data-query') || this.innerText;
        input.value = queryText;
        input.focus();
        handleQuerySubmit(queryText);
      });
    });

    // Handle Form Submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const question = input.value.trim();
      if (!question || question.length < 3) {
        announceStatus('Please enter a question with at least 3 characters.');
        input.focus();
        return;
      }
      handleQuerySubmit(question);
    });

    async function handleQuerySubmit(question) {
      setLoading(true);
      announceStatus('Searching RPwD Act legal context and generating response...');

      // Render User Question Bubble
      appendMessage('user', question);
      input.value = '';

      try {
        const response = await fetch(WORKER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: question })
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const answerText = data.answer || 'No relevant information found.';
        const sectionsUsed = Array.isArray(data.sections_used) ? data.sections_used : [];

        appendMessage('assistant', answerText, sectionsUsed);
        announceStatus('Answer generated successfully.');

      } catch (err) {
        console.error('[EqualEdge AI Client Error]:', err);
        const fallbackMsg = 'Unable to connect to EqualEdge AI backend right now. Please verify your connection or try again shortly.';
        appendMessage('error', fallbackMsg);
        announceStatus('Error generating response. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    function appendMessage(role, text, sections = []) {
      const msgWrapper = document.createElement('div');
      msgWrapper.className = `my-4 p-5 rounded-2xl transition-all ${
        role === 'user'
          ? 'bg-primary/10 border border-primary/20 text-foreground ml-8 sm:ml-16'
          : role === 'error'
          ? 'bg-destructive/10 border border-destructive/20 text-destructive'
          : 'bg-card border border-border text-card-foreground shadow-sm mr-8 sm:mr-16'
      }`;

      const header = document.createElement('div');
      header.className = 'flex items-center gap-2 font-bold text-sm mb-2';
      
      if (role === 'user') {
        header.innerHTML = '<span class="h-2 w-2 rounded-full bg-primary"></span> You asked:';
      } else if (role === 'error') {
        header.innerHTML = '⚠️ Error:';
      } else {
        header.innerHTML = '<span class="h-2 w-2 rounded-full bg-green-500"></span> EqualEdge AI (RPwD Act Guidance):';
      }

      const body = document.createElement('div');
      body.className = 'text-base leading-relaxed whitespace-pre-wrap';
      body.textContent = text;

      msgWrapper.appendChild(header);
      msgWrapper.appendChild(body);

      // Render Citations Badge if applicable
      if (sections.length > 0) {
        const citations = document.createElement('div');
        citations.className = 'mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs text-muted-foreground';
        citations.innerHTML = '<strong class="font-semibold">Cites RPwD Act Sections:</strong> ' +
          sections.map(s => `<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Section ${s}</span>`).join(' ');
        msgWrapper.appendChild(citations);
      }

      resultsContainer.appendChild(msgWrapper);
      msgWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setLoading(isLoading) {
      if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.innerHTML = isLoading
          ? '<span class="inline-block animate-spin mr-2">⏳</span> Processing...'
          : 'Ask EqualEdge AI';
      }
    }

    function announceStatus(message) {
      if (statusRegion) {
        statusRegion.textContent = message;
      }
    }
  });
})();
