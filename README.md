# FMS-project

## Overview

File Management System for ECoR Internship

## Prerequisites

Python 3.x installed on your machine. You can download it from [python.org](https://www.python.org/downloads/).

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/Srustika-18/FMS-project.git
cd FMS-project/railway_file_management
```

### 2. Create a Virtual Environment

Create a virtual environment in the project directory:

```sh
python -m venv venv
```

### 3. Activate the Virtual Environment

Activate the virtual environment:

```sh
.\venv\Scripts\activate
```

### 4. Install Dependencies

Install the required dependencies using the `requirements.txt` file:

```sh
pip install -r requirements.txt
```

### 5. Run the Project


```sh
uvicorn app.main:app --reload
```
