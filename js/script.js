// DOM Elements
const themeToggle = document.getElementById('theme-toggle-icon');
const originalPromptInput = document.getElementById('original-prompt');
const enhanceBtn = document.getElementById('enhance-btn');
const resetBtn = document.getElementById('reset-btn');
const resultSection = document.getElementById('result-section');
const enhancedPromptDiv = document.getElementById('enhanced-prompt');
const copyBtn = document.getElementById('copy-btn');
const loader = document.getElementById('loader');
const errorMessageDiv = document.getElementById('error-message');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Reset button handler
resetBtn.addEventListener('click', () => {
    originalPromptInput.value = '';
    resultSection.classList.add('hidden');
});

// Copy button handler
copyBtn.addEventListener('click', () => {
    const enhancedText = enhancedPromptDiv.innerText;
    navigator.clipboard.writeText(enhancedText)
        .then(() => {
            // Change button icon temporarily to show success
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text. Please try again.');
        });
});

// Main enhance button handler
enhanceBtn.addEventListener('click', async () => {
    const originalPrompt = originalPromptInput.value.trim();
    if (!originalPrompt) {
        alert('Please enter a prompt to enhance.');
        originalPromptInput.focus();
        return;
    }

    // Clear any previous error message
    if (errorMessageDiv) {
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.textContent = '';
    }
    
    // Show loader
    loader.classList.remove('hidden');
    
    try {
        const enhancedPrompt = await enhancePrompt(originalPrompt);
        console.log('Enhanced prompt received:', enhancedPrompt);
        
        // Show result
        enhancedPromptDiv.textContent = enhancedPrompt;
        resultSection.classList.remove('hidden');
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error enhancing prompt:', error);
        
        // Show error message if available
        if (errorMessageDiv) {
            errorMessageDiv.textContent = `Error: ${error.message || "Something went wrong. Please try again."}`;
            errorMessageDiv.classList.remove('hidden');
        } else {
            alert('Something went wrong while enhancing your prompt. Please try again.');
        }
    } finally {
        // Hide loader
        loader.classList.add('hidden');
    }
});

// Function to enhance prompt using Pollinations API
async function enhancePrompt(originalPrompt) {
    // System prompt
    const systemPrompt = "You are an expert prompt engineer. Your task is to enhance the user's prompt to make it more detailed, creative, and effective for AI image or text generation. Expand on the concepts, add relevant details, and improve clarity. Return only the enhanced prompt without explanations.";
    
    // Prepare the API request
    const requestBody = {
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please enhance this prompt: "${originalPrompt}"` }
        ],
        model: "openai",
        seed: Math.floor(Math.random() * 10000),
        private: true
    };
    
    console.log('Sending request to Pollinations API:', requestBody);
    
    // Call the Pollinations API
    const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    // Try to parse as JSON first
    try {
        const data = await response.json();
        console.log('API response:', data);
        
        // Handle different response formats
        if (data && typeof data === 'string') {
            return data;
        } else if (data && data.content) {
            return data.content;
        } else if (data && data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            // If it's an unknown object format, try to use it directly
            return JSON.stringify(data);
        }
    } catch (e) {
        // If JSON parsing fails, get the response as text
        const text = await response.text();
        console.log('API response (text):', text);
        return text;
    }
}

// Keyboard shortcut for enhance (Ctrl+Enter)
originalPromptInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        enhanceBtn.click();
    }
});
