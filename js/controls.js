Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user?.isGM) return;

  // v13: 'controls' is a map, not an array
  const notesControl =
      controls.notes ??
      controls["notes"] ??
      Object.values(controls).find((c) => c?.name === "notes");

  if (!notesControl) return;

  // Ensure tools container exists (v13 can use array or map)
  notesControl.tools = notesControl.tools ?? (Array.isArray(notesControl.tools) ? notesControl.tools : {});

  const toolDef = {
    name: "activateHud",
    title: game.i18n.localize("CHUD.actions.activateHUD"),
    icon: "fas fa-comments",
    button: true,                    // stays a BUTTON (minimal change)
    visible: !!game.user?.isGM,
    onClick: () => {
      if (!game.ConversationHud) {
        ui.notifications?.warn("Conversation HUD isn’t ready yet.");
        return;
      }
      // Keep original intent: click triggers start/close as appropriate
      if (game.ConversationHud.conversationIsActive) {
        game.ConversationHud.handleCloseActiveConversation?.();
      } else {
        game.ConversationHud.onToggleConversation?.(true);
      }
    }
  };

  // Insert tool for both array and map shapes
  if (Array.isArray(notesControl.tools)) {
    notesControl.tools.push(toolDef);
  } else {
    notesControl.tools[toolDef.name] = toolDef;
  }
});