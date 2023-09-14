# ContentCalendar-plugin
This repository contains the Outerbase Custom Table Plugin, designed to enhance the visual representation of table data in Outerbase. 
An interactive Outerbase plugin designed for content creators. Display and manage your content with ease, from images to captions, and even post status. Tailored for creators who want a developer-friendly interface with seamless integration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Support and Contributions](#support-and-contributions)

## Prerequisites
- Familiarity with Outerbase and its database structure.
- Basic understanding of Web Components and JavaScript.

## Installation
1. Clone this repository to your local machine.
```git clone <repository-url>```
2. Navigate to your Outerbase dashboard.
3. Select "Explore marketplace" under "Installed Plugins".
4. Click the "Custom Plugin" button.
5. Enter a name for your plugin and paste the code from this repository.

## Usage
1. Navigate to your desired Base project within Outerbase.
2. Click on the table you want to visualize.
3. Select the "Table view" button located on the top right section.
4. From the dropdown, choose the custom plugin you just added.
5. Set up your variables as needed.
6. Experience a refreshed and enhanced visualization of your data in Outerbase.

## Configuration

The plugin is designed to be highly customizable to cater to various data visualization needs. Below are the primary configuration variables available:

- **imageKey**: Determines which data column should be used to fetch the images displayed in the visual grid. If not specified, it defaults to `undefined`.
  
- **optionalImagePrefix**: This is an optional variable to prepend a static URL path to your images if they are stored with relative paths. It defaults to `undefined`.

- **titleKey**: Defines the data column key that should be used to fetch titles for each grid item. If not specified, it defaults to `undefined`.

- **captionKey**: Specifies which data column should be used to fetch captions or short descriptions for the visual grid. It defaults to `undefined`.

- **contentLinkKey**: Determines which data column should be used to fetch the link associated with a specific grid item, useful for items that might link out to external content or detailed views. If not specified, it defaults to `undefined`.

Remember to set these variables according to your Outerbase table structure to ensure the plugin works optimally and displays the desired content.
