# Security setup

The application no longer keeps administrator, Telegram, or WhatsApp credentials in committed source files or browser storage.

## Required deployment variables

Copy the variable names from `.env.example` into the deployment environment. Use newly rotated credentials; do not reuse values that were previously committed.

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (at least 12 characters)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_TARGET_CHAT_ID`
- `WHATSAPP_INSTANCE_ID`
- `WHATSAPP_API_TOKEN`

The Telegram call integration variables and `WHATSAPP_GROUP_LINK` are optional and documented in `.env.example`.

## Required rotation

1. Revoke and regenerate the Telegram bot token through BotFather.
2. Revoke the exposed Telegram MTProto session and create a new session only if call integration is still required.
3. Rotate the WhatsApp provider API token and instance credentials.
4. Configure the new values in the deployment environment, then redeploy.
5. Treat old Git history and existing deployments as compromised until credentials have been rotated.

Local admin testing uses a browser-local account created on first login. Production login uses `/api/admin-auth` and the server environment only.

> The login gate does not replace Supabase Row Level Security. Review RLS policies before treating database writes as fully protected.
