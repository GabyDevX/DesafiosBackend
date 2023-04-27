# 🛍️ Backend Coderhouse

This is a node.js application that simulates an e-commerce platform. It provides a fully functional backend for an online store, including the ability to perform CRUD operations on products and shopping carts with those products. It also has a chat feature, user authentication and authorization, and stores all data in MongoDB.

The application follows best practices for code structure, architecture, and security. It implements various libraries such as Express, Normalizr, Socket IO, Twilio, Nodemailer, and Bcrypt to provide a robust and reliable solution.

## 🚀 Features

### 🛍️ Product management

The application allows administrators to manage products by performing CRUD operations (Create, Read, Update, Delete). Administrators can create new products, view existing products, update product information, and delete products that are no longer available. Each product has a name, description, price, and image associated with it.

### 🛒 Shopping cart

Users can create shopping carts and add products to them. The application provides an API to manage the user's cart, allowing users to add and remove products and view the cart's contents.

### 🔑 User authentication and authorization

The application provides a secure way for users to sign up and log in to the platform. Passwords are hashed using Bcrypt to ensure that they are not stored in plain text.

Administrators have elevated privileges that allow them to manage products.

### 💬 Chat feature

The application provides a chat feature that allows users to communicate with each other in real-time. The chat feature uses Socket IO to provide real-time communication.

### 📨 Notifications

The application sends notifications to users via email and SMS. Users receive an email when they sign up. They also receive SMS notifications and emails when they place an order.

## 🛠️ Installation

To install this application, you will need to have Node.js and npm installed on your system. Once you have those, follow these steps:

1. Clone the repository to your local machine
2. Open a terminal window and navigate to the project directory
3. Run the command `npm i` to install all required dependencies

## 💻 Usage

To run the application, navigate to the root directory of the project and run the command:

```
node server.js
```

This will start the server and make the application accessible at http://localhost:8080.

## 🚀 Deployment

We have used the Railway platform to deploy this application on the web. You can access the live version of the project by clicking on the following link: https://desafiosbackend-production.up.railway.app/

## 🙏 Acknowledgements

I would like to express my sincere gratitude to [Marcos Villanueva](https://github.com/marcosvillanueva9) for his excellent work in teaching and maintaining a good interest in the course over the 6 months of classes. Thank you for sharing your knowledge and for being an inspiration to us all.

If you have any questions or feedback about this project, please feel free to reach out to me.
