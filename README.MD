# vpn-generator

A CLI tool to generate one-day trial accounts for **hidexk.name** VPN service. This tool automates the process of account creation, verification, and login to the VPN app — making the experience seamless with just a few steps.

## Features

- Automatically generates one-day trial VPN accounts for **hidexk.name**
- Opens Chrome and waits for user to activate VPN via **Troywell** extension
- Copies the generated email to clipboard
- Automatically retrieves the verification code after email confirmation
- Launches the **hidemy.name VPN** app and logs in automatically
- Supports `--not-logged` flag if you're not already logged into the app

## Installation

### Install globally via npm:

```
export PUPPETEER_SKIP_DOWNLOAD=true
sudo npm install -g vpn-generator
```

> ⚠️ **Important:**  
> After installation, you **must enable Accessibility access** for your terminal (Terminal or iTerm2):
>
> - Go to **System Settings** → **Privacy & Security** → **Accessibility**
> - Enable access for your terminal app (e.g., Terminal, iTerm)

## Usage

Once installed, simply run:

```
vpn
```

This will:

1. Launch Chrome
2. Prompt you to manually enable VPN using the **Troywell** browser extension
3. Wait for you to press any key in the terminal once VPN is activated
4. Automatically create a trial account, verify the email, and copy credentials
5. Open the **hidemy.name VPN** application and log you in

### If you're not logged into the VPN app

Run the command with the `--not-logged` flag:

```
vpn --not-logged
```

This ensures the tool knows to perform the login process from scratch inside the VPN app UI.

## Requirements

- macOS system with **Accessibility access granted** for the terminal
- Installed **Troywell** extension in Chrome
- VPN app **hidemy.name VPN** installed in `/Applications`

## License

MIT License
