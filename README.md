# GraphicHub - GitHub for Graphic Designers

GraphicHub is a website designed for graphic designers, providing a platform for sharing and showcasing their projects. It is built using React, MongoDB, Express.js, and CSS, and it is fully responsive, so users can access it from any device.

## Features

### User Profiles
Each user has a personal profile page where they can display their projects, bio, and contact information. Users can also follow each other and receive notifications when a followed user uploads a new project.

### Public and Private Projects
Users can choose to make their projects either public or private. Public projects are visible to everyone, while private projects can only be viewed by users who have been given access.

### Private View Mode
GraphicHub offers a unique feature called "Private View Mode," which allows users to share their private projects with selected individuals. The owner of the project can generate a key that gives access to the project, which can have an expiration date.

### Like
Users can like projects, making it easier to give feedback and engage with each other. This feature can help users improve their skills by receiving constructive criticism.

## Environment Variables
To run GraphicHub locally or in production, you will need to set the following environment variables:

- `HOST_ADDRESS`: The address of the host where the application is running.
- `REACT_APP_PRESENT_NAME`: The name of the Cloudinary cloud used for storing images.
- `REACT_APP_CLOUD_NAME`: The name of the Cloudinary account.
- `REACT_APP_CLOUDINARY_URL`: The URL of the Cloudinary API.
- `REACT_APP_CLOUDINARY_API_SECRET`: The secret key for the Cloudinary API.
- `REACT_APP_CLOUDINARY_API_KEY`: The API key for the Cloudinary API.
- `PRESENT_NAME`: The name of the app.
- `PORT`: The port number that the server will listen on. Defaults to `3000`.
- `NODE_ENV`: The environment in which the app is running. Set to `development` or `production`.
- `MONGO_URI`: The URI to connect to MongoDB.
- `JWT_SECRET`: The secret key used to sign JWT tokens.
- `EMAIL_USER`: The email address used to send notification emails.
- `EMAIL_SERVICE`: The email service used to send notification emails.
- `EMAIL_PASSWORD`: The password used to authenticate the email address.
- `EMAIL_ADDRESS`: The email address to receive feedback from users.
- `CLOUD_NAME`: The name of the Cloudinary account.
- `CLOUDINARY_URL`: The URL of the Cloudinary API.
- `CLOUDINARY_API_SECRET`: The secret key for the Cloudinary API.
- `CLOUDINARY_API_KEY`: The API key for the Cloudinary API.
- `ADMIN_TOKEN`: The token used to authenticate admin users.

## Installation

To run GraphicHub, you will need to install Node.js and MongoDB. Once you have installed these dependencies, clone the repository and install the required packages using the following commands:

```
git clone https://github.com/omerg864/graphic-hub.git
cd graphic-hub
npm run install_all
```

To start the development server, run the following command:

```
npm run dev
```

## Conclusion

GraphicHub is a powerful platform that provides graphic designers with the tools they need to showcase their skills and build their portfolios. With features like user profiles, private view mode, and like, GraphicHub is a must-have tool for any aspiring graphic designer.

## Contributing

Contributions to this project are welcome! To contribute, please fork the repository and create a pull request with your changes. Before submitting a pull request, please make sure that your changes are consistent with the existing code and follow the project's coding standards.