# React Bit - Social Media App

## Sample Work

![image](https://github.com/user-attachments/assets/3d639ace-a990-4c1e-a96c-462616e06912)

![image](https://github.com/user-attachments/assets/f93926d8-bc99-4be6-8ff5-afd482965110)



## Description

React Bit is a social media application with realtime chat and notification features.

## Technologies

* **Frontend:**
    * React + Vite
    * Tailwind CSS + Shadcn UI
    * Zustand
    * React Query
    * Axios
    * User-password login + Google social auth, with forgot password features
    * React Hook Form
    * Zod
    * Rich Text Editor: reactjs-tiptap-editor
* **Backend:**
    * Django
    * Django Channels
    * Django Allauth
    * dj-rest-auth
    * Django Rest Framework (DRF)

## Features

* Realtime chat
* Notifications
* User authentication (user-password and Google)
* Forgot password functionality
* Rich text posts

## How to Run the Project

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project folder:
    ```bash
    cd project_folder
    ```
3.  Install React dependencies:
    ```bash
    npm install
    ```
4.  Install Django (backend) dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Apply database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
6.  Run the Django development server:
    ```bash
    python manage.py runserver
    ```
7.  Run the React development server:
    ```bash
    npm run dev
    ```

## Notes

* Ensure you have Python and Node.js installed.
* Replace `<repository_url>` with the actual URL of your Git repository.
* The Django server will typically run on `http://localhost:8000/`.
* The React development server will typically run on `http://localhost:5173/`.  (Or other port if vite chooses)
