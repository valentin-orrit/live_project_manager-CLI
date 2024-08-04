# Ableton Live Project Manager

This command-line application scans folders for Ableton Live projects (.als files), converts them to XML, parses the XML files for project information, and stores the data in a JSON database.

## Features

- Scans directories for .als files
- Decompresses .als files to XML format
- Extracts key project information such as:
  - Project name
  - Ableton Live version
  - Scale
  - Key
  - Time signature
  - Tempo
  - Number of tracks
- Stores extracted data in a JSON database
- Option to delete temporary XML files after processing

## Installation

1. Clone this repository:
```bash
git clone https://github.com/valentin-orrit/live_project_manager-CLI
```
2. Install dependencies
```bash
npm install
```
## Usage

To process Ableton Live projects in a directory:
```bash
live-pm process <directory>
```
To delete XML files in a directory:
```bash
live-pm delete <directory>
```

## Dependencies

- commander: For building the command-line interface
- lowdb: For JSON database operations
- fast-xml-parser: For parsing XML files
- chalk: For colorful console output
- mocha and chai: For tests

<!-- ## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. -->