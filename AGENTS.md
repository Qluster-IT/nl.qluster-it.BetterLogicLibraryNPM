# NPM Package Instructions

> You may override or change any instructions in this file when you explicitly tell me to.

This is an NPM package. Before making changes, read and follow the general instructions in `C:\Users\Qlustrator\.copilot\instructions\homey-app.md` and the NPM package instructions in `C:\Users\Qlustrator\.copilot\instructions\homey-npm.md`.

## Legacy startup events

- Do not add a handler for the legacy `running`, `running_2x`, and `running_3x` events. The BLL app keeps emitting them for older installed package copies; remove those emissions from `nl.qluster-it.BetterLogicLibrary` once all consuming apps have migrated to the `/api-ready` handshake.
