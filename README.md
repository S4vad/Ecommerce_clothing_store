# 🛍️ E-Commerce Clothing Store  

Welcome to the E-Commerce Clothing Store project! This web application is a comprehensive e-commerce platform for men's and women's clothing and accessories, built using modern web technologies and integrated with advanced machine learning features.  

---

## 🌟 Features  

- **Dynamic Product Management**:  
  - Add, update, and delete products via an admin panel.  
  - Display multiple images for each product.  
  - Search and filter products by categories, price, and more.  

- **User-Friendly Design**:  
  - Responsive UI with EJS templates and Bootstrap.  
  - Cart, Wishlist, and Order Management functionalities.  

- **Advanced Machine Learning Integration**:  
  - **Password Strength Checker**:  
    - Implemented using `RandomForestClassifier` to evaluate and ensure strong user passwords.  
  - **Sentiment Analysis**:  
    - Logistic Regression model to analyze and classify customer reviews.  
  - **Product Recommendation**:  
    - Image-based recommendations using `ResNet50` for feature extraction.  

- **RESTful API Communication**:  
  - Utilized `FastAPI` to handle interactions between machine learning models and the backend.  

---

## 🛠️ Tech Stack  

- **Frontend**:  
  - EJS (Embedded JavaScript)  
  - Bootstrap for responsive and user-friendly design  

- **Backend**:  
  - Node.js with Express  
  - MongoDB for the database  
  - RESTful API for seamless communication  

- **Machine Learning**:  
  - Python-based ML models integrated via `FastAPI`:  
    - **Password Strength Checker**: Random Forest Classifier  
    - **Sentiment Analysis**: Logistic Regression  
    - **Product Recommendation**: ResNet50 for feature extraction  

---

## ⚙️ Installation and Setup  

1. **Install Backend Dependencies and Set Up Environment Variables**  
   - Install dependencies:  
     ```bash  
     npm install  
     ```  
   - Create a `.env` file in the root directory with the following:  
     ```env  
     MONGO_URI=your_mongodb_connection_string  
     PORT=your_server_port  
     FASTAPI_URL=your_fastapi_server_url  
     ```  

2. **Run the Server**  
   - Start the backend server:  
     ```bash  
     npm start  
     ```  

3. **Start the Machine Learning API Server**  
   - Navigate to the `ml-api` directory and run:  
     ```bash  
     uvicorn app:app --reload  
     ```  


---

## 🚀 Key Functionalities  

- **Password Strength Checker**: Strengthens user account security by analyzing password patterns and scoring them.  
- **Sentiment Analysis**: Classifies customer reviews into positive, negative, or neutral sentiments to improve user experience.  
- **Product Recommendations**: Uses ResNet50 for feature extraction and suggests visually similar products.  

---

## 🧪 Testing  

- Run backend tests with:  
```bash  
npm test
 ```  

----
## 🔗 Acknowledgements
- **MongoDB for database management
- **ResNet50 and FastAPI for advanced ML functionalities
- **Bootstrap for responsive design

---

## Contributors
- Your Name
- LinkedIn: [savadk](https://linkedin.com/in/savadk)
- Email: 8594savad8594@gmail.com
