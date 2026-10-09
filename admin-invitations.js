(function initializeAdminInvitations() {
  const button = document.getElementById("generateInviteButton");
  const message = document.getElementById("inviteMessage");
  const result = document.getElementById("inviteResult");
  const link = document.getElementById("inviteLink");
  const copyButton = document.getElementById("copyInviteButton");
  if (!button || !message || !result || !link || !copyButton) return;

  function showMessage(text, color = "#b7bdc6") {
    message.textContent = text;
    message.style.color = color;
  }

  button.addEventListener("click", async () => {
    const token = getAdminToken();
    if (!token) {
      showMessage("Reconnectez-vous à l’espace Administrateur.", "#ff6b6b");
      return;
    }

    button.disabled = true;
    showMessage("Création du lien en cours…");
    result.hidden = true;

    try {
      const response = await fetch(
        "https://point-focal.onrender.com/api/admin/prelaunch-invites",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json"
          }
        }
      );
      const payload = await response.json().catch(() => ({}));
      const data = payload.data || payload;
      if (!response.ok || !data.invitationUrl) {
        throw new Error(payload.message || "Impossible de créer le lien.");
      }

      link.href = data.invitationUrl;
      link.textContent = data.invitationUrl;
      result.hidden = false;
      showMessage("Lien créé. Il ne pourra servir qu’une seule fois.", "#4cff8a");
    } catch (error) {
      showMessage(error.message || "Impossible de créer le lien.", "#ff6b6b");
    } finally {
      button.disabled = false;
    }
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link.href);
      showMessage("Lien copié.", "#4cff8a");
    } catch (error) {
      showMessage("Copie impossible. Sélectionnez le lien pour le copier.", "#ff6b6b");
    }
  });
})();
