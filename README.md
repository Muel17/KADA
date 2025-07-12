# KADA - Cinema Ticketing System

![KADA Logo](https://placehold.co/600x300/1e293b/ffffff?text=KADA+Cinema)

## 🎬 Introduction

KADA is a modern, web-based cinema ticketing system inspired by popular platforms like Cinema XXI and CGV. This project aims to provide a seamless and user-friendly experience for browsing movies, selecting seats, and booking tickets online. It's built primarily with **TypeScript**, bringing type safety and robustness to the application, along with JavaScript and CSS for a dynamic and polished user interface.

## ✨ Features

* **Movie Listings:** Browse a list of currently showing and upcoming movies.
* **Detailed Movie Information:** View details for each movie, including synopsis, cast, duration, and rating.
* **Showtime Selection:** Choose from available showtimes and cinema locations.
* **Interactive Seat Map:** Select your preferred seats from a visual and interactive seat layout.
* **Booking & Reservation:** A straightforward booking process to reserve your selected tickets.
* **Responsive Design:** A clean and responsive UI that works across desktops, tablets, and mobile devices.

## 💻 Tech Stack

This project is built using a modern web technology stack:

* **TypeScript:** For robust, scalable, and maintainable code.
* **JavaScript (ES6+):** For core application logic and interactivity.
* **HTML5 & CSS3:** For structuring the application and creating a visually appealing design.
* **Frameworks/Libraries:** (Optional: You can add any frameworks like React, Vue, or Node.js if you used them).

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your machine:

* [Node.js](https://nodejs.org/) (which includes npm)
    ```bash
    # Check if Node.js and npm are installed
    node -v
    npm -v
    ```
* A modern web browser like Chrome, Firefox, or Safari.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Muel17/KADA.git](https://github.com/Muel17/KADA.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd KADA
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Compile TypeScript to JavaScript:**
    (This command assumes you have a `tsconfig.json` file set up to compile to a `dist` or `build` folder).
    ```bash
    npm run build
    # or
    tsc
    ```

### Running the Application

Once the installation is complete, you can run the application.

1.  **Start a local development server.** A simple way is to use a tool like `live-server` or a basic Python server.
    * **Using `live-server` (if installed):**
        ```bash
        live-server
        ```
    * **Using Python's built-in server:**
        ```bash
        # For Python 3
        python -m http.server
        ```

2.  **Open your browser** and navigate to `http://localhost:8080` (or the port specified by your server). You should now see the KADA Cinema Ticketing System in action!

## 📸 Screenshots

*(Here you can add screenshots of your application. This is a great way to quickly show off your work!)*

| Movie Listing Page | Seat Selection |
| :---: | :---: |
| ![Movie Listing](https://placehold.co/400x300/334155/ffffff?text=Movie+List+UI) | ![Seat Selection](https://placehold.co/400x300/334155/ffffff?text=Seat+Map+UI) |

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

## 📜 License

Distributed under the MIT License. See `LICENSE` file for more information.
