# React Bit - Social Media App

![image](https://github.com/user-attachments/assets/a8131ac6-631a-4045-a388-d8b459904f7e)

![image](https://github.com/user-attachments/assets/3d639ace-a990-4c1e-a96c-462616e06912)

![image](https://github.com/user-attachments/assets/f93926d8-bc99-4be6-8ff5-afd482965110)

![image](https://github.com/user-attachments/assets/48b1ba72-69d3-40ba-a25b-9dd3a9266723)

![image](https://github.com/user-attachments/assets/d261032d-44d8-4200-afab-1fb8a5704abe)

![image](https://github.com/user-attachments/assets/3b5525ce-5137-4162-afca-65475f1a05f2)

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
    https://github.com/pyserve/reactbit.git
    ```
2.  Navigate to the project folder:
    ```bash
    cd reactbit
    ```
3.  Install React dependencies:
    ```bash
    npm install
    ```
4.  Install Django (backend) dependencies inside backend folder:
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
* The Django server will typically run on `http://localhost:8000/`.
* The React development server will typically run on `http://localhost:5173/`.
