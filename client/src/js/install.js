const butInstall = document.getElementById('buttonInstall');
// Logic for installing the PWA

// Show the install button if the PWA isn't installed yet
window.addEventListener('beforeinstallprompt', (event) => {
    // Set the deferredPrompt property of the event as the prompt
    window.deferredPrompt = event;
    // Show the install button
    butInstall.classList.toggle('hidden', false);
    console.log('PWA can be installed');
});


// Install the PWA when the user clicks on the install button
butInstall.addEventListener('click', async () => {

    // Variable that stores the deferredPrompt property of the window
    const promptEvent = window.deferredPrompt;

    // If there is no prompt event, return
    if (!promptEvent) {
        return;
    }

    // Show the install prompt to the user
    promptEvent.prompt();

    // Sets the prompt to null as it can only be used once
    window.deferredPrompt = null;

    // Hide the install button
    butInstall.classList.toggle('hidden', true);
});


// Hide the install button if the PWA is already installed
window.addEventListener('appinstalled', () => {
    // Set the deferredPrompt property of the window to null
    window.deferredPrompt = null;
    // Hide the install button
    butInstall.innerHTML = 'Installed';
});
