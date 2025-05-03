# PDF Organizer

PDF Organizer is a desktop application designed to help users efficiently manage, rename, and organize PDF files. It provides features such as navigating through PDF files, renaming files, moving them to target folders, and deleting unwanted files.

## Features

- **PDF Navigation**: Navigate through a list of PDF files in a selected folder.
- **File Renaming**: Rename PDF files with ease.
- **Folder Organization**: Move files to specific subfolders within the selected folder.
- **PDF Viewer**: View PDF files directly within the application.
- **File Deletion**: Delete unwanted PDF files.

## Technologies Used

- **React**: For building the user interface.
- **Electron**: For creating the desktop application.
- **Material-UI**: For UI components and styling.
- **PDF.js**: For rendering PDF files.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pdf-organizer.git
   cd pdf-organizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   npm run start
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```

### Running the Application

1. Launch the application:
   ```bash
   npm run electron
   ```

2. Use the "Select Folder" button to choose a folder containing PDF files.

3. Navigate through the files, rename them, move them to subfolders, or delete them as needed.

## Folder Structure

- **src/renderer/components**: Contains React components for the UI.
- **src/renderer/App.tsx**: Main application logic and layout.
- **src/main**: Electron main process logic.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering.
- [Material-UI](https://mui.com/) for UI components.
