# vpn-generator

A CLI tool to generate one-day trial accounts for **hidexk.name** VPN service. This tool automates the process of creating accounts, verifying emails, and enabling VPN within a browser. It also works with the recommended **Troywell** browser extension for seamless VPN operation.

## Features

- Automatically generates one-day trial VPN accounts for **hidexk.name**.
- Starts the VPN program and enables VPN in the browser.
- Works with the **Troywell** browser extension for better experience.
- Copies the generated email to the clipboard.
- After email verification, automatically retrieves the verification code and completes the setup.

## Installation

### Install globally via npm:

```
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
sudo npm install -g vpn-generator
```

## Usage

Once the library is installed, you can use the `vpn` command in the terminal:

```
vpn
```

### Workflow

1. The program will generate a one-day trial VPN account for **hidexk.name**.
2. It will automatically open the browser.
3. The **Troywell** browser extension should be installed and active for best results.
4. Once the browser is open, the user must manually enable the VPN.
5. The generated email will be copied to your clipboard.
6. After the email is confirmed, the program will wait for a minute and then retrieve the verification code.
7. The program will automatically enter the code and complete the account setup.

### Requirements

- The **Troywell** browser extension must be installed and enabled in your browser for VPN activation.
- Make sure to allow the program to interact with your browser for best automation.

## Troubleshooting

- **Troywell extension not detected**: Make sure the extension is properly installed and enabled in your browser. You can check the extension's settings to ensure it is working.
- **Email verification code not retrieved**: This could be due to delays in the email system. Please ensure that your email client isn't blocking emails from **hidexk.name**.

## License

MIT License
