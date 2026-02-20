<div align="center">
  <img src="docs/assets/hero-banner.png" alt="Onyx Vault Hero Image" width="100%" />

  # Onyx Vault
  **A Zero-Knowledge, beautifully designed desktop password manager that syncs securely to your own Google Drive.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=black)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](#)
</div>

---

## 🔒 The Pitch
Most password managers ask you to trust their servers with your encrypted data. **Onyx Vault** removes the middleman entirely. It is a native Windows application that encrypts your passwords locally using military-grade cryptography, and then syncs the scrambled ciphertext directly to a hidden, protected folder in *your own* Google Drive. 

**Zero servers. Zero knowledge. 100% your data.**

## ✨ Key Features
* **True Zero-Knowledge Architecture:** Your Master Password never leaves your device and is never stored.
* **BYOS (Bring Your Own Storage):** Seamlessly syncs via the Google Drive REST API using the restricted `appDataFolder` scope to prevent accidental deletion.
* **Offline First:** Local rolling backups ensure you always have access to your vault, even without an internet connection.
* **Modern UI/UX:** A clean, distraction-free interface built with React and Tailwind CSS, featuring a built-in password generator and security health dashboard.
* **Memory Safe Engine:** Powered by a Rust/Tauri backend for blazing-fast cryptographic operations.

---

## 🎨 UI/UX Case Study
*For recruiters and design leads: This project was built with a heavy emphasis on user experience, turning a complex cryptographic workflow into an intuitive, frictionless interface.*

1. **The Trust Factor:** Security tools often look intimidating. The dark-mode UI was designed using deep navies and soft grays to evoke a calm, professional environment that builds immediate user trust.
2. **Handling Complex States:** The interface gracefully manages the asynchronous complexities of cloud syncing, providing clear user feedback during Google OAuth handoffs, vault decryption loading states, and offline mode.
3. **Data Visualization:** The Security Health Dashboard translates raw vault data into easily digestible metrics (weak passwords, reused credentials) with clear calls to action.

> **[Link to full Figma Mockups / Design Process Here]**

---

## 🛡️ Security Architecture
* **Key Derivation:** Master Passwords are run through **Argon2id** (with a locally stored salt) to generate a 256-bit encryption key.
* **Encryption:** The local SQLite/JSON vault is encrypted using **AES-256-GCM**, ensuring both confidentiality and data authenticity.
* **Volatile Memory:** Decrypted plaintext data only exists in the system's RAM and is wiped immediately upon app lock.

---

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion (for fluid animations)
* **Backend / Window Manager:** Tauri (Rust)
* **Cryptography:** Web Crypto API / Rust `ring`
* **Cloud Sync:** Google Drive API v3

---

## 🚀 Getting Started (Development)

### Prerequisites
* Node.js (v18+)
* Rust (`rustup`)
* A Google Cloud Console account (to generate your Drive API OAuth credentials)

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/onyx-vault.git](https://github.com/yourusername/onyx-vault.git)
